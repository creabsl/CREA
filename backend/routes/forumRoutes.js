const express = require('express');
const router = express.Router();
const { ForumTopic, ForumPost } = require('../models/forumModels');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createNotification } = require('../controllers/notificationController');
const User = require('../models/userModel');

// Topics
router.get('/topics', async (req, res) => {
  try { 
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const items = await ForumTopic.find(filter).sort({ createdAt: -1 }); 
    return res.json(items); 
  }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});
router.post('/topics', protect, adminOnly, async (req, res) => {
  try {
    const topic = await ForumTopic.create({ 
      title: req.body.title, 
      author: req.body.author || (req.user?.name || 'Member'), 
      createdAtStr: req.body.createdAt,
      category: req.body.category || 'general'
    });
    return res.status(201).json(topic);
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});
router.put('/topics/:id', protect, adminOnly, async (req, res) => {
  try { const t = await ForumTopic.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true }); if(!t) return res.status(404).json({message:'Not found'}); return res.json(t); }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});
router.delete('/topics/:id', protect, adminOnly, async (req, res) => {
  try { const t = await ForumTopic.findByIdAndDelete(req.params.id); if(!t) return res.status(404).json({message:'Not found'}); await ForumPost.deleteMany({ topicId: t._id }); return res.json({ success: true }); }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Posts
// Get posts for a topic. Admins see all posts, regular users see only approved posts and their own posts.
router.get('/topics/:id/posts', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    let isAdmin = false;
    let userName = null;
    
    // Check if user is authenticated
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = require('../models/userModel');
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          isAdmin = user.role === 'admin';
          userName = user.name;
        }
      } catch (err) {
        // Token invalid, continue as unauthenticated user
      }
    }
    
    const items = await ForumPost.find({ topicId: req.params.id }).sort({ createdAt: 1 });
    
    // Filter posts: admins see all, users see approved posts + their own posts
    const filtered = items.filter(p => isAdmin || p.approved === true || p.author === userName);
    
    // map to include derived fields for frontend convenience
    const mapped = filtered.map(p => ({
      _id: p._id,
      author: p.author,
      content: p.content,
      createdAt: p.createdAt,
      createdAtStr: p.createdAtStr,
      approved: p.approved,
      likesCount: Array.isArray(p.likedBy) ? p.likedBy.length : 0,
      // Filter comments: admins see all, users see approved comments + their own comments
      comments: Array.isArray(p.comments) ? p.comments.filter(c => isAdmin || c.approved === true || c.author === userName) : [],
    }));
    return res.json(mapped);
  }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Members can post replies (protected). Previously this required adminOnly — allow authenticated members.
router.post('/topics/:id/posts', protect, async (req, res) => {
  try {
    // Admin posts are auto-approved, regular user posts need approval
    const isAdmin = req.user?.role === 'admin';
    console.log(`Creating post - User: ${req.user?.name}, Role: ${req.user?.role}, IsAdmin: ${isAdmin}, Content: ${req.body.content}`);
    
    const post = await ForumPost.create({ 
      topicId: req.params.id, 
      author: req.body.author || (req.user?.name || 'Member'), 
      content: req.body.content, 
      createdAtStr: req.body.createdAt,
      approved: isAdmin === true // Explicitly set to true for admin, false for others
    });
    
    console.log(`Post created - ID: ${post._id}, Approved: ${post.approved}, User Role: ${req.user?.role}`);
    await ForumTopic.findByIdAndUpdate(req.params.id, { $inc: { replies: 1 } });
    return res.status(201).json(post);
  } catch (e) { 
    console.error('Error creating post:', e); 
    return res.status(500).json({ message: 'Server error', error: e.message }); 
  }
});

// Toggle like/unlike for a post by the authenticated user
router.post('/topics/:topicId/posts/:postId/like', protect, async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.user && (req.user._id ? String(req.user._id) : String(req.user.id || ''))
    if (!userId) return res.status(401).json({ message: 'Not authorized' })
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    post.likedBy = post.likedBy || []
    const idx = post.likedBy.indexOf(userId)
    let liked = false
    if (idx === -1) {
      post.likedBy.push(userId)
      liked = true
    } else {
      post.likedBy.splice(idx, 1)
      liked = false
    }
    await post.save()
    return res.json({ likesCount: post.likedBy.length, liked })
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Add a comment to a post (nested comment)
router.post('/topics/:topicId/posts/:postId/comments', protect, async (req, res) => {
  try {
    const { postId } = req.params
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    const author = req.body.author || (req.user?.name || 'Member')
    const content = req.body.content
    if (!content || !content.trim()) return res.status(400).json({ message: 'Content required' })
    
    // Admin comments are auto-approved, regular user comments need approval
    const isAdmin = req.user?.role === 'admin';
    console.log(`Creating comment - User: ${req.user?.name}, Role: ${req.user?.role}, IsAdmin: ${isAdmin}`);
    const comment = { author, content, createdAtStr: req.body.createdAt, approved: isAdmin === true }
    post.comments = post.comments || []
    post.comments.push(comment)
    await post.save()
    console.log(`Comment created - Approved: ${comment.approved}`);
    return res.status(201).json(comment)
  } catch (e) { 
    console.error('Error creating comment:', e); 
    return res.status(500).json({ message: 'Server error', error: e.message }); 
  }
});

// Delete a post (author or admin only)
router.delete('/topics/:topicId/posts/:postId', protect, async (req, res) => {
  try {
    const { topicId, postId } = req.params
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    
    // Check if user is admin or the author
    const isAdmin = req.user?.role === 'admin'
    const isAuthor = post.author === req.user?.name
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this post' })
    }
    
    await ForumPost.findByIdAndDelete(postId)
    await ForumTopic.findByIdAndUpdate(topicId, { $inc: { replies: -1 } })
    return res.json({ success: true })
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Delete a comment from a post (comment author or admin only)
router.delete('/topics/:topicId/posts/:postId/comments/:commentIndex', protect, async (req, res) => {
  try {
    const { postId, commentIndex } = req.params
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    
    const idx = parseInt(commentIndex, 10)
    if (isNaN(idx) || idx < 0 || idx >= (post.comments || []).length) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    
    const comment = post.comments[idx]
    const isAdmin = req.user?.role === 'admin'
    const isAuthor = comment.author === req.user?.name
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' })
    }
    
    post.comments.splice(idx, 1)
    await post.save()
    return res.json({ success: true })
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// ========== ADMIN APPROVAL ENDPOINTS ==========

// Get all pending posts (admin only)
router.get('/admin/pending-posts', protect, adminOnly, async (req, res) => {
  try {
    const posts = await ForumPost.find({ approved: false }).populate('topicId').sort({ createdAt: -1 });
    const mapped = posts.map(p => ({
      _id: p._id,
      topicId: p.topicId?._id,
      topicTitle: p.topicId?.title || 'Unknown Topic',
      author: p.author,
      content: p.content,
      createdAt: p.createdAt,
      createdAtStr: p.createdAtStr,
      approved: p.approved,
    }));
    return res.json(mapped);
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Get all pending comments (admin only)
router.get('/admin/pending-comments', protect, adminOnly, async (req, res) => {
  try {
    const posts = await ForumPost.find({ 'comments.approved': false }).populate('topicId');
    const pendingComments = [];
    posts.forEach(post => {
      post.comments.forEach((comment, idx) => {
        if (!comment.approved) {
          pendingComments.push({
            postId: post._id,
            topicId: post.topicId?._id,
            topicTitle: post.topicId?.title || 'Unknown Topic',
            postContent: post.content.substring(0, 50) + '...',
            commentIndex: idx,
            author: comment.author,
            content: comment.content,
            createdAt: comment.createdAtStr,
          });
        }
      });
    });
    return res.json(pendingComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Approve a post (admin only)
router.patch('/admin/posts/:postId/approve', protect, adminOnly, async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(
      req.params.postId,
      { approved: true },
      { new: true }
    ).populate('topicId');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Find user by author name and send notification
    const user = await User.findOne({ name: post.author });
    if (user) {
      await createNotification(
        user._id,
        'forum',
        'Your forum post has been approved',
        `Your post in "${post.topicId?.title || 'a topic'}" has been approved and is now visible to all members.`,
        `/forum`,
        { postId: post._id, topicId: post.topicId?._id }
      );
    }
    
    return res.json({ success: true, post });
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Reject/Delete a pending post (admin only)
router.delete('/admin/posts/:postId', protect, adminOnly, async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndDelete(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json({ success: true });
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Approve a comment (admin only)
router.patch('/admin/posts/:postId/comments/:commentIndex/approve', protect, adminOnly, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId).populate('topicId');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const idx = parseInt(req.params.commentIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= post.comments.length) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const comment = post.comments[idx];
    post.comments[idx].approved = true;
    await post.save();
    
    // Find user by comment author name and send notification
    const user = await User.findOne({ name: comment.author });
    if (user) {
      await createNotification(
        user._id,
        'forum',
        'Your comment has been approved',
        `Your comment in "${post.topicId?.title || 'a topic'}" has been approved and is now visible to all members.`,
        `/forum`,
        { postId: post._id, topicId: post.topicId?._id }
      );
    }
    
    return res.json({ success: true });
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Reject/Delete a pending comment (admin only)
router.delete('/admin/posts/:postId/comments/:commentIndex', protect, adminOnly, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const idx = parseInt(req.params.commentIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= post.comments.length) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    post.comments.splice(idx, 1);
    await post.save();
    return res.json({ success: true });
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
