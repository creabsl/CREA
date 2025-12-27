const AboutMilestone = require("../models/aboutMilestoneModel");

// Get all active milestones
exports.getMilestones = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === "true" ? {} : { isActive: true };

    const milestones = await AboutMilestone.find(filter)
      .sort({ year: 1, order: 1 })
      .populate("createdBy", "name email");

    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch milestones", error: error.message });
  }
};

// Get milestone by ID
exports.getMilestoneById = async (req, res) => {
  try {
    const milestone = await AboutMilestone.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.json(milestone);
  } catch (error) {
    console.error("Error fetching milestone:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch milestone", error: error.message });
  }
};

// Create milestone (admin only)
exports.createMilestone = async (req, res) => {
  try {
    const { year, title, description, icon, order, isActive } = req.body;

    // Validation
    if (!year || !title || !description) {
      return res.status(400).json({
        message: "Year, title, and description are required",
      });
    }

    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({
        message: "Year must be a 4-digit number",
      });
    }

    const milestoneData = {
      year,
      title,
      description,
      icon: icon || "🎉",
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id,
    };

    const milestone = await AboutMilestone.create(milestoneData);
    const populated = await AboutMilestone.findById(milestone._id).populate(
      "createdBy",
      "name email"
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating milestone:", error);
    res
      .status(500)
      .json({ message: "Failed to create milestone", error: error.message });
  }
};

// Update milestone (admin only)
exports.updateMilestone = async (req, res) => {
  try {
    const { year, title, description, icon, order, isActive } = req.body;

    const updateData = {};
    if (year !== undefined) {
      if (!/^\d{4}$/.test(year)) {
        return res
          .status(400)
          .json({ message: "Year must be a 4-digit number" });
      }
      updateData.year = year;
    }
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const milestone = await AboutMilestone.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.json(milestone);
  } catch (error) {
    console.error("Error updating milestone:", error);
    res
      .status(500)
      .json({ message: "Failed to update milestone", error: error.message });
  }
};

// Delete milestone (admin only)
exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await AboutMilestone.findByIdAndDelete(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.json({ message: "Milestone deleted successfully", milestone });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res
      .status(500)
      .json({ message: "Failed to delete milestone", error: error.message });
  }
};

// Bulk delete milestones (admin only)
exports.deleteMilestones = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of milestone IDs" });
    }

    const result = await AboutMilestone.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `Successfully deleted ${result.deletedCount} milestone(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting milestones:", error);
    res
      .status(500)
      .json({ message: "Failed to delete milestones", error: error.message });
  }
};
