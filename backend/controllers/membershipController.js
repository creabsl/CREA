const Membership = require('../models/membershipModel');

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
