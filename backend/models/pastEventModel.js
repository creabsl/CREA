const mongoose = require("mongoose");

const pastEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    type: {
      type: String,
      enum: ["photo", "video"],
      default: "photo",
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
    description: {
      type: String,
      default: "",
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },
    date: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
pastEventSchema.index({ order: 1 });
pastEventSchema.index({ isActive: 1 });
pastEventSchema.index({ createdAt: -1 });

const PastEvent = mongoose.model("PastEvent", pastEventSchema);

module.exports = PastEvent;
