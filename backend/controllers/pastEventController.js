const PastEvent = require("../models/pastEventModel");

/**
 * Get all past events
 * @route GET /api/past-events
 */
exports.getPastEvents = async (req, res) => {
  try {
    const { includeInactive } = req.query;

    const filter = {};
    if (includeInactive !== "true") {
      filter.isActive = true;
    }

    const events = await PastEvent.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Transform to match frontend PastEvent type
    const transformedEvents = events.map((event) => ({
      id: event._id.toString(),
      _id: event._id.toString(),
      title: event.title,
      type: event.type,
      thumbnail: event.thumbnail,
      description: event.description || "",
      date: event.date || "",
      order: event.order,
      isActive: event.isActive,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));

    res.json(transformedEvents);
  } catch (error) {
    console.error("Get past events error:", error);
    res.status(500).json({ message: "Failed to fetch past events" });
  }
};

/**
 * Get single past event by ID
 * @route GET /api/past-events/:id
 */
exports.getPastEventById = async (req, res) => {
  try {
    const event = await PastEvent.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({ message: "Past event not found" });
    }

    const transformedEvent = {
      id: event._id.toString(),
      _id: event._id.toString(),
      title: event.title,
      type: event.type,
      thumbnail: event.thumbnail,
      description: event.description || "",
      date: event.date || "",
      order: event.order,
      isActive: event.isActive,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    res.json(transformedEvent);
  } catch (error) {
    console.error("Get past event by ID error:", error);
    res.status(500).json({ message: "Failed to fetch past event" });
  }
};

/**
 * Create new past event
 * @route POST /api/past-events
 */
exports.createPastEvent = async (req, res) => {
  try {
    const { title, type, thumbnail, description, date, order, isActive } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Event title is required" });
    }

    if (!thumbnail || !thumbnail.trim()) {
      return res.status(400).json({ message: "Thumbnail URL is required" });
    }

    if (type && !["photo", "video"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Type must be 'photo' or 'video'" });
    }

    const eventData = {
      title: title.trim(),
      type: type || "photo",
      thumbnail: thumbnail.trim(),
      description: description?.trim() || "",
      date: date?.trim() || "",
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user?.id,
    };

    const event = await PastEvent.create(eventData);

    const transformedEvent = {
      id: event._id.toString(),
      _id: event._id.toString(),
      title: event.title,
      type: event.type,
      thumbnail: event.thumbnail,
      description: event.description,
      date: event.date,
      order: event.order,
      isActive: event.isActive,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    res.status(201).json(transformedEvent);
  } catch (error) {
    console.error("Create past event error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to create past event" });
  }
};

/**
 * Update past event
 * @route PUT /api/past-events/:id
 */
exports.updatePastEvent = async (req, res) => {
  try {
    const { title, type, thumbnail, description, date, order, isActive } =
      req.body;

    const event = await PastEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Past event not found" });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Event title cannot be empty" });
      }
      event.title = title.trim();
    }

    if (type !== undefined) {
      if (!["photo", "video"].includes(type)) {
        return res
          .status(400)
          .json({ message: "Type must be 'photo' or 'video'" });
      }
      event.type = type;
    }

    if (thumbnail !== undefined) {
      if (!thumbnail.trim()) {
        return res
          .status(400)
          .json({ message: "Thumbnail URL cannot be empty" });
      }
      event.thumbnail = thumbnail.trim();
    }

    if (description !== undefined) {
      event.description = description.trim();
    }

    if (date !== undefined) {
      event.date = date.trim();
    }

    if (order !== undefined) {
      event.order = order;
    }

    if (isActive !== undefined) {
      event.isActive = isActive;
    }

    await event.save();

    const transformedEvent = {
      id: event._id.toString(),
      _id: event._id.toString(),
      title: event.title,
      type: event.type,
      thumbnail: event.thumbnail,
      description: event.description,
      date: event.date,
      order: event.order,
      isActive: event.isActive,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    res.json(transformedEvent);
  } catch (error) {
    console.error("Update past event error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update past event" });
  }
};

/**
 * Delete past event
 * @route DELETE /api/past-events/:id
 */
exports.deletePastEvent = async (req, res) => {
  try {
    const event = await PastEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Past event not found" });
    }

    await PastEvent.deleteOne({ _id: req.params.id });

    res.json({ message: "Past event deleted successfully" });
  } catch (error) {
    console.error("Delete past event error:", error);
    res.status(500).json({ message: "Failed to delete past event" });
  }
};

/**
 * Delete multiple past events (bulk delete)
 * @route POST /api/past-events/bulk-delete
 */
exports.deletePastEvents = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of event IDs" });
    }

    const result = await PastEvent.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `Deleted ${result.deletedCount} past event(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete past events error:", error);
    res.status(500).json({ message: "Failed to delete past events" });
  }
};
