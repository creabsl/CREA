const MutualTransfer = require('../models/mutualTransferModel');

const SAFE_REGEX = /[.*+?^${}()|[\]\\]/g;
const escapeRegex = (value = '') => value.replace(SAFE_REGEX, '\\$&');

const toDto = (doc) => {
  const plain = doc.toObject ? doc.toObject({ virtuals: false }) : doc;
  const owner = plain.user && typeof plain.user === 'object' ? plain.user : null;
  const ownerId = owner?.id || owner?._id?.toString() || (typeof plain.user === 'string' ? plain.user : '');

  return {
    id: plain._id?.toString?.() || plain.id,
    // Legacy field for backward compatibility
    post: plain.post || plain.currentDesignation,
    // New structured fields
    currentDesignation: plain.currentDesignation || plain.post,
    currentDivision: plain.currentDivision || '',
    currentDepartment: plain.currentDepartment || '',
    currentLocation: plain.currentLocation,
    desiredDesignation: plain.desiredDesignation || plain.post,
    desiredLocation: plain.desiredLocation,
    availabilityDate: plain.availabilityDate ? new Date(plain.availabilityDate).toISOString() : null,
    notes: plain.notes || '',
    contactName: plain.contactName || owner?.name || '',
    contactEmail: plain.contactEmail || owner?.email || '',
    contactPhone: plain.contactPhone || '',
    isActive: plain.isActive,
    ownerId,
    ownerDesignation: owner?.designation || '',
    ownerDivision: owner?.division || '',
    createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : null,
    updatedAt: plain.updatedAt ? new Date(plain.updatedAt).toISOString() : null,
  };
};

const canManage = (req, record) => {
  if (!req.user) return false;
  if (req.user.role === 'admin') return true;
  const owner = record.user && typeof record.user === 'object' && record.user !== null
    ? record.user._id?.toString?.() || record.user.id
    : record.user?.toString?.();
  return owner === req.user.id;
};

exports.listTransfers = async (req, res) => {
  try {
    const { post, current, desired, includeInactive } = req.query;
    const filter = {};

    if (!includeInactive || includeInactive === 'false') filter.isActive = true;
    
    // Search in both legacy 'post' field and new designation fields for backward compatibility
    if (post) {
      const postRegex = { $regex: escapeRegex(String(post).trim()), $options: 'i' };
      filter.$or = [
        { post: postRegex },
        { currentDesignation: postRegex },
        { desiredDesignation: postRegex }
      ];
    }
    
    if (current) filter.currentLocation = { $regex: escapeRegex(String(current).trim()), $options: 'i' };
    if (desired) filter.desiredLocation = { $regex: escapeRegex(String(desired).trim()), $options: 'i' };

    const transfers = await MutualTransfer.find(filter)
      .populate('user', 'name email designation division department role')
      .sort({ isActive: -1, updatedAt: -1 });

    return res.json(transfers.map(toDto));
  } catch (error) {
    console.error('List mutual transfers error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.createTransfer = async (req, res) => {
  try {
    const { 
      post, // legacy field
      currentDesignation,
      desiredDesignation,
      currentLocation, 
      desiredLocation, 
      notes, 
      contactPhone, 
      contactEmail, 
      contactName, 
      availabilityDate 
    } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    // Auto-populate current position from user profile
    const currDesig = currentDesignation || req.user.designation || post;
    const desDesig = desiredDesignation || post;
    
    if (!currDesig || !currentLocation || !desiredLocation || !desDesig) {
      return res.status(400).json({ 
        message: 'Current designation, desired designation, current location, and desired location are required' 
      });
    }

    let availability;
    if (availabilityDate) {
      const parsed = new Date(availabilityDate);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ message: 'Invalid availability date' });
      }
      availability = parsed;
    }

    const record = await MutualTransfer.create({
      user: req.user._id,
      // Auto-populate current position from user profile
      currentDesignation: String(currDesig).trim(),
      currentDivision: req.user.division || '',
      currentDepartment: req.user.department || '',
      currentLocation: String(currentLocation).trim(),
      desiredDesignation: String(desDesig).trim(),
      desiredLocation: String(desiredLocation).trim(),
      notes: notes ? String(notes).trim() : undefined,
      contactPhone: contactPhone ? String(contactPhone).trim() : undefined,
      contactEmail: contactEmail ? String(contactEmail).trim().toLowerCase() : req.user.email,
      contactName: contactName ? String(contactName).trim() : req.user.name,
      availabilityDate: availability,
      isActive: true,
      // Keep legacy field for backward compatibility
      post: String(currDesig).trim(),
    });

    const populated = await record.populate('user', 'name email designation division department role');
    return res.status(201).json(toDto(populated));
  } catch (error) {
    console.error('Create mutual transfer error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listMine = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const transfers = await MutualTransfer.find({ user: req.user._id })
      .populate('user', 'name email designation division role')
      .sort({ updatedAt: -1 });
    return res.json(transfers.map(toDto));
  } catch (error) {
    console.error('List my mutual transfers error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTransfer = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { id } = req.params;
    const record = await MutualTransfer.findById(id);
    if (!record) return res.status(404).json({ message: 'Listing not found' });
    if (!canManage(req, record)) return res.status(403).json({ message: 'Not authorized to update this listing' });

    const payload = req.body || {};

    if (payload.post !== undefined) {
      const value = String(payload.post).trim();
      if (!value) return res.status(400).json({ message: 'Post cannot be empty' });
      record.post = value;
    }
    if (payload.currentLocation !== undefined) {
      const value = String(payload.currentLocation).trim();
      if (!value) return res.status(400).json({ message: 'Current location cannot be empty' });
      record.currentLocation = value;
    }
    if (payload.desiredLocation !== undefined) {
      const value = String(payload.desiredLocation).trim();
      if (!value) return res.status(400).json({ message: 'Desired location cannot be empty' });
      record.desiredLocation = value;
    }
    if (payload.notes !== undefined) {
      record.notes = payload.notes ? String(payload.notes).trim() : undefined;
    }
    if (payload.contactPhone !== undefined) {
      record.contactPhone = payload.contactPhone ? String(payload.contactPhone).trim() : undefined;
    }
    if (payload.contactEmail !== undefined) {
      record.contactEmail = payload.contactEmail ? String(payload.contactEmail).trim().toLowerCase() : undefined;
    }
    if (payload.contactName !== undefined) {
      record.contactName = payload.contactName ? String(payload.contactName).trim() : undefined;
    }
    if (payload.isActive !== undefined) {
      const next = typeof payload.isActive === 'string' ? payload.isActive === 'true' : Boolean(payload.isActive);
      record.isActive = next;
    }
    if (payload.availabilityDate !== undefined) {
      if (!payload.availabilityDate) {
        record.availabilityDate = undefined;
      } else {
        const parsed = new Date(payload.availabilityDate);
        if (Number.isNaN(parsed.getTime())) {
          return res.status(400).json({ message: 'Invalid availability date' });
        }
        record.availabilityDate = parsed;
      }
    }

    await record.save();
    const populated = await record.populate('user', 'name email designation division role');
    return res.json(toDto(populated));
  } catch (error) {
    console.error('Update mutual transfer error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTransfer = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { id } = req.params;
    const record = await MutualTransfer.findById(id);
    if (!record) return res.status(404).json({ message: 'Listing not found' });
    if (!canManage(req, record)) return res.status(403).json({ message: 'Not authorized to delete this listing' });

    await record.deleteOne();
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete mutual transfer error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
