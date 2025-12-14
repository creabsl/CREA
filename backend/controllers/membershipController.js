const Membership = require('../models/membershipModel');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// POST /api/memberships
exports.submitMembership = async (req, res) => {
  try {
    const payload = req.body || {};
    
    // Validate required fields before attempting to save
    const requiredFields = ['name', 'email', 'mobile', 'designation', 'division', 'department', 'type'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Create new membership
    const membership = new Membership({
      ...payload,
      user: req.user?._id,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Set validity period
    membership.setValidity();

    // Save membership
    await membership.save();

    return res.status(201).json({ 
      success: true, 
      membershipId: membership.membershipId,
      paymentStatus: membership.paymentStatus
    });
  } catch (err) {
    console.error('Submit membership error:', err.message || err);
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered for membership' 
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + Object.keys(err.errors).join(', ') 
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/memberships (admin)
exports.listMemberships = async (req, res) => {
  try {
    const { status, department, type } = req.query;
    const query = {};

    if (status) query.status = status;
    if (department) query.department = department;
    if (type) query.type = type;

    const list = await Membership.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    // Add expiry status to each membership
    const membershipsWithStatus = list.map(membership => ({
      ...membership.toObject(),
      isExpired: membership.isExpired()
    }));

    return res.json(membershipsWithStatus);
  } catch (err) {
    console.error('List memberships error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/memberships/:id/status
exports.updateMembershipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, paymentReference } = req.body;

    const membership = await Membership.findById(id).populate('userId');
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    const previousStatus = membership.status;
    
    if (status) membership.status = status;
    if (paymentStatus) {
      membership.paymentStatus = paymentStatus;
      if (paymentStatus === 'completed') {
        membership.paymentDate = new Date();
        membership.paymentReference = paymentReference;
        membership.status = 'active';
      }
    }

    await membership.save();
    
    // Send notification on status change
    const { createNotification } = require('./notificationController');
    if (membership.userId && previousStatus !== membership.status) {
      let notifMessage = '';
      if (membership.status === 'active') {
        notifMessage = 'Your membership application has been approved and is now active!';
      } else if (membership.status === 'rejected') {
        notifMessage = 'Your membership application has been reviewed. Please contact admin for more details.';
      } else if (membership.status === 'pending') {
        notifMessage = 'Your membership application is under review.';
      }
      
      if (notifMessage) {
        await createNotification(
          membership.userId._id || membership.userId,
          'membership',
          'Membership Status Updated',
          notifMessage,
          '/profile',
          { membershipId: membership._id, status: membership.status }
        );
      }
    }
    
    return res.json({ success: true, membership });
  } catch (err) {
    console.error('Update membership status error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/memberships/:id/renew
exports.renewMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReference, amount } = req.body;

    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    await membership.renew(paymentReference, amount);
    return res.json({ success: true, membership });
  } catch (err) {
    console.error('Renew membership error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/memberships/stats
exports.getMembershipStats = async (req, res) => {
  try {
    const stats = await Membership.aggregate([
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byDepartment: [
            { $group: { _id: '$department', count: { $sum: 1 } } }
          ],
          byType: [
            { $group: { _id: '$type', count: { $sum: 1 } } }
          ],
          total: [
            { $group: { _id: null, count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    return res.json(stats[0]);
  } catch (err) {
    console.error('Get membership stats error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/memberships/bulk-upload (admin)
exports.bulkUploadMembers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let members = [];

    // Parse CSV file
    if (fileExtension === '.csv') {
      members = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    } 
    // Parse Excel file (.xlsx, .xls)
    else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      members = XLSX.utils.sheet_to_json(sheet);
    } 
    else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file format. Please upload CSV or Excel file.' 
      });
    }

    // Validate and process members
    const results = {
      success: [],
      failed: [],
      total: members.length
    };

    const requiredFields = ['name', 'email', 'mobile', 'designation', 'division', 'department', 'type'];

    for (let i = 0; i < members.length; i++) {
      const memberData = members[i];
      const rowNumber = i + 2; // +2 because row 1 is header and array is 0-indexed

      try {
        // Normalize field names (handle different case variations)
        const normalizedData = {};
        Object.keys(memberData).forEach(key => {
          const normalizedKey = key.trim().toLowerCase();
          normalizedData[normalizedKey] = memberData[key];
        });

        // Map common field variations
        const fieldMapping = {
          'name': ['name', 'full name', 'fullname', 'member name'],
          'email': ['email', 'e-mail', 'email address'],
          'mobile': ['mobile', 'phone', 'contact', 'mobile number', 'phone number'],
          'designation': ['designation', 'position', 'post'],
          'division': ['division', 'div'],
          'department': ['department', 'dept'],
          'type': ['type', 'membership type', 'membershiptype'],
          'place': ['place', 'location'],
          'unit': ['unit'],
          'paymentMethod': ['payment method', 'paymentmethod', 'payment'],
          'paymentAmount': ['payment amount', 'paymentamount', 'amount'],
          'purchaseDate': ['purchase date', 'purchasedate', 'date of purchase', 'membership date', 'start date', 'startdate']
        };

        const processedData = {};
        Object.keys(fieldMapping).forEach(field => {
          const variations = fieldMapping[field];
          for (const variation of variations) {
            if (normalizedData[variation] !== undefined && normalizedData[variation] !== '') {
              processedData[field] = normalizedData[variation];
              break;
            }
          }
        });

        // Check required fields
        const missingFields = requiredFields.filter(field => !processedData[field]);
        if (missingFields.length > 0) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Missing required fields: ${missingFields.join(', ')}`
          });
          continue;
        }

        // Validate membership type
        const membershipType = processedData.type.toLowerCase();
        if (!['ordinary', 'lifetime'].includes(membershipType)) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Invalid membership type: ${processedData.type}. Must be 'ordinary' or 'lifetime'`
          });
          continue;
        }

        // Parse and validate purchase date if provided
        let purchaseDate = new Date(); // Default to current date
        if (processedData.purchaseDate) {
          const parsedDate = new Date(processedData.purchaseDate);
          if (isNaN(parsedDate.getTime())) {
            results.failed.push({
              row: rowNumber,
              data: memberData,
              error: `Invalid purchase date format: ${processedData.purchaseDate}. Use YYYY-MM-DD or MM/DD/YYYY`
            });
            continue;
          }
          purchaseDate = parsedDate;
        }

        // Calculate validity dates based on purchase date
        const validFrom = new Date(purchaseDate);
        let validUntil;
        
        if (membershipType === 'lifetime') {
          validUntil = new Date(2099, 11, 31); // Far future date for lifetime members
        } else {
          // For ordinary membership, add 1 year to purchase date
          validUntil = new Date(validFrom);
          validUntil.setFullYear(validUntil.getFullYear() + 1);
        }

        // Prepare membership document
        const membershipDoc = {
          name: processedData.name,
          email: processedData.email.toLowerCase().trim(),
          mobile: processedData.mobile,
          designation: processedData.designation,
          division: processedData.division,
          department: processedData.department,
          place: processedData.place || 'Not specified',
          unit: processedData.unit || 'Not specified',
          type: membershipType,
          paymentMethod: processedData.paymentMethod || 'upi',
          paymentAmount: processedData.paymentAmount || (membershipType === 'lifetime' ? 5000 : 500),
          paymentStatus: 'pending',
          status: 'pending',
          validFrom: validFrom,
          validUntil: validUntil,
          paymentDate: purchaseDate
        };

        // Check for duplicate email
        const existingMember = await Membership.findOne({ email: membershipDoc.email });
        if (existingMember) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Email already exists: ${membershipDoc.email}`
          });
          continue;
        }

        // Create and save membership (validity dates already set above)
        const membership = new Membership(membershipDoc);
        await membership.save();

        results.success.push({
          row: rowNumber,
          membershipId: membership.membershipId,
          name: membership.name,
          email: membership.email,
          validFrom: membership.validFrom,
          validUntil: membership.validUntil
        });

      } catch (error) {
        results.failed.push({
          row: rowNumber,
          data: memberData,
          error: error.message || 'Unknown error'
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: `Processed ${results.total} records. ${results.success.length} successful, ${results.failed.length} failed.`,
      results
    });

  } catch (err) {
    console.error('Bulk upload error:', err);
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during bulk upload',
      error: err.message 
    });
  }
};
