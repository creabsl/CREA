const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["announcement", "achievement", "promotion", "event"],
      default: "announcement",
    },
    priority: {
      type: String,
      enum: ["high", "normal"],
      default: "normal",
    },
    link: {
      type: String,
      trim: true,
    },
    imageUrl: String,
    videoUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Advertisement", advertisementSchema);
