const mongoose = require("mongoose");

const aboutMilestoneSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{4}$/.test(v);
        },
        message: "Year must be a 4-digit number",
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "🎉",
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
  { timestamps: true }
);

// Index for efficient querying and sorting
aboutMilestoneSchema.index({ year: 1, order: 1 });
aboutMilestoneSchema.index({ isActive: 1 });

module.exports = mongoose.model("AboutMilestone", aboutMilestoneSchema);
