const mongoose = require('mongoose');

const forumTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['technical', 'social', 'organizational', 'general'],
      default: 'general'
    },
    createdAtStr: { type: String },
    replies: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const forumPostSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic', required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    createdAtStr: { type: String },
    approved: { type: Boolean, default: false }, // Posts require admin approval
    // track user ids who liked this post (store as strings to avoid coupling)
    likedBy: [{ type: String }],
    // simple nested comments stored on a post
    comments: [
      {
        author: { type: String, required: true },
        content: { type: String, required: true },
        createdAtStr: { type: String },
        approved: { type: Boolean, default: false }, // Comments require admin approval
      },
    ],
  },
  { timestamps: true }
);

module.exports = {
  ForumTopic: mongoose.model('ForumTopic', forumTopicSchema),
  ForumPost: mongoose.model('ForumPost', forumPostSchema),
};
