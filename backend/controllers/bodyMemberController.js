const BodyMember = require('../models/bodyMemberModel');

// @desc    Get all body members (with optional division filter)
// @route   GET /api/body-members?division=Mumbai
// @access  Public
exports.getBodyMembers = async (req, res) => {
  try {
    const { division } = req.query;
    const filter = division ? { division } : {};
    
    const bodyMembers = await BodyMember.find(filter).sort({ createdAt: -1 });
    
    return res.status(200).json(bodyMembers);
  } catch (error) {
    console.error('Get body members error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single body member by ID
// @route   GET /api/body-members/:id
// @access  Public
exports.getBodyMemberById = async (req, res) => {
  try {
    const bodyMember = await BodyMember.findById(req.params.id);
    
    if (!bodyMember) {
      return res.status(404).json({ message: 'Body member not found' });
    }
    
    return res.status(200).json(bodyMember);
  } catch (error) {
    console.error('Get body member error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new body member
// @route   POST /api/body-members
// @access  Private/Admin
exports.createBodyMember = async (req, res) => {
  try {
    const { name, designation, photoUrl, division } = req.body;

    if (!name || !designation || !photoUrl || !division) {
      return res.status(400).json({ 
        message: 'Please provide name, designation, photo, and division' 
      });
    }

    const bodyMember = await BodyMember.create({
      name,
      designation,
      photoUrl,
      division
    });

    return res.status(201).json(bodyMember);
  } catch (error) {
    console.error('Create body member error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update body member
// @route   PUT /api/body-members/:id
// @access  Private/Admin
exports.updateBodyMember = async (req, res) => {
  try {
    const { name, designation, photoUrl, division } = req.body;

    const bodyMember = await BodyMember.findById(req.params.id);

    if (!bodyMember) {
      return res.status(404).json({ message: 'Body member not found' });
    }

    bodyMember.name = name || bodyMember.name;
    bodyMember.designation = designation || bodyMember.designation;
    bodyMember.photoUrl = photoUrl || bodyMember.photoUrl;
    bodyMember.division = division || bodyMember.division;

    const updatedBodyMember = await bodyMember.save();

    return res.status(200).json(updatedBodyMember);
  } catch (error) {
    console.error('Update body member error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete body member
// @route   DELETE /api/body-members/:id
// @access  Private/Admin
exports.deleteBodyMember = async (req, res) => {
  try {
    const bodyMember = await BodyMember.findById(req.params.id);

    if (!bodyMember) {
      return res.status(404).json({ message: 'Body member not found' });
    }

    await bodyMember.deleteOne();

    return res.status(200).json({ message: 'Body member removed' });
  } catch (error) {
    console.error('Delete body member error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
