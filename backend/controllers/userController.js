const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendMail } = require('../config/mailer');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// Helper function to generate next Member ID
const generateNextMemberId = async (membershipType) => {
  const prefix = membershipType === 'Ordinary' ? 'ORD' : 'LIF';
  const regex = new RegExp(`^${prefix}-\\d{4}$`);
  
  // Find all existing IDs with this prefix and extract the numeric part
  const existingUsers = await User.find({ memberId: regex }).select('memberId').lean();
  
  if (existingUsers.length === 0) {
    return `${prefix}-0001`;
  }
  
  // Extract numbers and find the highest
  const numbers = existingUsers.map(u => {
    const match = u.memberId.match(/\d{4}$/);
    return match ? parseInt(match[0], 10) : 0;
  });
  
  const maxNumber = Math.max(...numbers);
  const nextNumber = maxNumber + 1;
  
  // Pad with zeros to make it 4 digits
  const paddedNumber = String(nextNumber).padStart(4, '0');
  
  return `${prefix}-${paddedNumber}`;
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, designation, division, department, membershipType } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      designation,
      division,
      department,
      membershipType,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      division: user.division,
      department: user.department,
      mobile: user.mobile,
      membershipType: user.membershipType,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      division: user.division,
      department: user.department,
      mobile: user.mobile,
      memberId: user.memberId,
      membershipType: user.membershipType,
      isMember: user.isMember,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    List users (optionally filter by division); admin only
// @route   GET /api/users
// @access  Admin
exports.listUsers = async (req, res) => {
  try {
    const { division, role } = req.query;
    const filter = {};
    if (division) filter.division = division;
    if (role) filter.role = role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a user (admin editable fields)
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, division, department, mobile, membershipType, role } = req.body;

    // Only allow safe fields; password/email updates are out-of-scope here
    const patch = {};
    if (typeof name === 'string') patch.name = name;
    if (typeof designation === 'string') patch.designation = designation;
    if (typeof division === 'string') patch.division = division;
    if (typeof department === 'string') patch.department = department;
    if (typeof mobile === 'string') patch.mobile = mobile;
    if (typeof membershipType === 'string') patch.membershipType = membershipType;
    // role change allowed but restrict to known values
    if (role === 'admin' || role === 'member') patch.role = role;

    const updated = await User.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get own profile
// @route   GET /api/users/profile
// @access  Private (any authenticated user)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      division: user.division,
      department: user.department,
      mobile: user.mobile,
      memberId: user.memberId,
      membershipType: user.membershipType,
      isMember: user.isMember,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update own profile (member self-edit)
// @route   PUT /api/users/profile
// @access  Private (any authenticated user)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, designation, division, department, mobile } = req.body;

    // Members can only update their own profile fields (not role/membershipType)
    const patch = {};
    if (typeof name === 'string') patch.name = name;
    if (typeof designation === 'string') patch.designation = designation;
    if (typeof division === 'string') patch.division = division;
    if (typeof department === 'string') patch.department = department;
    if (typeof mobile === 'string') patch.mobile = mobile;

    const updated = await User.findByIdAndUpdate(userId, { $set: patch }, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    
    return res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      designation: updated.designation,
      division: updated.division,
      department: updated.department,
      mobile: updated.mobile,
      membershipType: updated.membershipType,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Activate membership (generate Member ID, update status, send email)
// @route   POST /api/users/activate-membership
// @access  Private (authenticated user)
exports.activateMembership = async (req, res) => {
  try {
    const userId = req.user._id;
    const { membershipType } = req.body; // 'Ordinary' or 'Lifetime'
    
    if (!membershipType || !['Ordinary', 'Lifetime'].includes(membershipType)) {
      return res.status(400).json({ message: 'Invalid membership type. Must be Ordinary or Lifetime.' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const oldMemberId = user.memberId;
    const isUpgrade = oldMemberId && oldMemberId.startsWith('ORD-') && membershipType === 'Lifetime';
    const isNew = !oldMemberId;
    
    // Generate new Member ID
    const newMemberId = await generateNextMemberId(membershipType);
    
    // Update user document
    user.memberId = newMemberId;
    user.membershipType = membershipType;
    user.isMember = true;
    
    await user.save();
    
    // Send email notification
    let emailSubject, emailBody;
    
    if (isNew) {
      // New member
      emailSubject = 'Welcome to CREA - Membership Confirmed';
      emailBody = `
        <h2>Welcome to Central Railway Engineers Association!</h2>
        <p>Dear ${user.name},</p>
        <p>Congratulations! Your membership has been successfully activated.</p>
        <p><strong>Your Unique Member ID:</strong> <span style="color: #0d2c54; font-size: 18px; font-weight: bold;">${newMemberId}</span></p>
        <p><strong>Membership Type:</strong> ${membershipType}</p>
        <p>Please use this Member ID for all future communications and transactions with CREA.</p>
        <br>
        <p>Best regards,<br>CREA Team</p>
      `;
    } else if (isUpgrade) {
      // Upgrade from Ordinary to Lifetime
      emailSubject = 'Membership Upgrade Successful - CREA';
      emailBody = `
        <h2>Congratulations on Your Membership Upgrade!</h2>
        <p>Dear ${user.name},</p>
        <p>Your membership has been successfully upgraded to <strong>Lifetime Membership</strong>.</p>
        <p><strong style="color: #dc2626;">OLD Member ID (No Longer Valid):</strong> <span style="text-decoration: line-through;">${oldMemberId}</span></p>
        <p><strong>NEW Lifetime Member ID:</strong> <span style="color: #0d2c54; font-size: 18px; font-weight: bold;">${newMemberId}</span></p>
        <p>Please update your records and use the NEW Member ID for all future interactions.</p>
        <br>
        <p>Best regards,<br>CREA Team</p>
      `;
    } else {
      // Same type reactivation or edge case
      emailSubject = 'CREA Membership Confirmed';
      emailBody = `
        <h2>Membership Confirmed</h2>
        <p>Dear ${user.name},</p>
        <p>Your membership has been confirmed.</p>
        <p><strong>Your Member ID:</strong> <span style="color: #0d2c54; font-size: 18px; font-weight: bold;">${newMemberId}</span></p>
        <p><strong>Membership Type:</strong> ${membershipType}</p>
        <br>
        <p>Best regards,<br>CREA Team</p>
      `;
    }
    
    // Send email
    try {
      await sendMail({
        to: user.email,
        subject: emailSubject,
        html: emailBody,
      });
    } catch (emailError) {
      console.error('Failed to send membership email:', emailError);
      // Continue even if email fails - membership is still activated
    }
    
    return res.json({
      success: true,
      message: 'Membership activated successfully',
      memberId: newMemberId,
      membershipType: membershipType,
      isUpgrade: isUpgrade,
      oldMemberId: isUpgrade ? oldMemberId : null,
    });
    
  } catch (error) {
    console.error('Activate membership error:', error);
    return res.status(500).json({ message: 'Server error during membership activation' });
  }
};
