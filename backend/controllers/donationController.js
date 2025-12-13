const Donation = require('../models/donationModel');

// Create a new donation
const createDonation = async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ 
      success: true, 
      message: 'Donation created successfully',
      data: donation 
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create donation',
      error: error.message 
    });
  }
};

// Get all donations (admin only)
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      data: donations 
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch donations',
      error: error.message 
    });
  }
};

// Get donation by ID (admin only)
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: donation 
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch donation',
      error: error.message 
    });
  }
};

// Update donation (admin only - for payment status updates)
const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Donation updated successfully',
      data: donation 
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update donation',
      error: error.message 
    });
  }
};

// Delete donation (admin only)
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Donation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete donation',
      error: error.message 
    });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation
};
