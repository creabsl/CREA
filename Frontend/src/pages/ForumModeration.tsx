import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePageTitle } from '../hooks/usePageTitle'
import Button from '../components/Button'
import { getPendingForumPosts, getPendingForumComments, approveForumPost, rejectForumPost, approveForumComment, rejectForumComment } from '../services/api'
import type { PendingForumPost, PendingForumComment } from '../types'

export default function ForumModeration() {
  usePageTitle('CREA • Forum Moderation')
  const [pendingPosts, setPendingPosts] = useState<PendingForumPost[]>([])
  const [pendingComments, setPendingComments] = useState<PendingForumComment[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [posts, comments] = await Promise.all([
        getPendingForumPosts(),
        getPendingForumComments()
      ])
      setPendingPosts(posts)
      setPendingComments(comments)
    } catch (error) {
      console.error('Error loading pending items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprovePost = async (postId: string) => {
    try {
      await approveForumPost(postId)
      setPendingPosts(pendingPosts.filter(p => p._id !== postId))
    } catch (error) {
      console.error('Error approving post:', error)
      alert('Failed to approve post')
    }
  }

  const handleRejectPost = async (postId: string) => {
    if (!confirm('Are you sure you want to reject this post?')) return
    try {
      await rejectForumPost(postId)
      setPendingPosts(pendingPosts.filter(p => p._id !== postId))
    } catch (error) {
      console.error('Error rejecting post:', error)
      alert('Failed to reject post')
    }
  }

  const handleApproveComment = async (postId: string, commentIndex: number) => {
    try {
      await approveForumComment(postId, commentIndex)
      setPendingComments(pendingComments.filter(c => !(c.postId === postId && c.commentIndex === commentIndex)))
    } catch (error) {
      console.error('Error approving comment:', error)
      alert('Failed to approve comment')
    }
  }

  const handleRejectComment = async (postId: string, commentIndex: number) => {
    if (!confirm('Are you sure you want to reject this comment?')) return
    try {
      await rejectForumComment(postId, commentIndex)
      setPendingComments(pendingComments.filter(c => !(c.postId === postId && c.commentIndex === commentIndex)))
    } catch (error) {
      console.error('Error rejecting comment:', error)
      alert('Failed to reject comment')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="relative rounded-xl bg-gradient-to-br from-[#0d2c54] via-[#19417d] to-[#0a2343] text-white p-8 overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold !text-white" style={{ color: 'white' }}>Forum Moderation</h1>
          </div>
          <p className="text-white/90 text-lg">Review and approve pending forum posts and comments</p>
        </div>
        
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Pending Posts</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{pendingPosts.length}</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Pending Comments</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{pendingComments.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'posts'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Pending Posts ({pendingPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'comments'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Pending Comments ({pendingComments.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Pending Posts ({pendingPosts.length})
              </h2>
              
              {pendingPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">No pending posts</p>
                  <p className="text-sm">All posts have been reviewed</p>
                </div>
              ) : (
                pendingPosts.map((post) => (
                  <motion.div
                    key={post._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {post.topicTitle}
                          </span>
                          <span className="text-sm text-gray-500">by {post.author}</span>
                        </div>
                        <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprovePost(post._id)}
                        variant="primary"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectPost(post._id)}
                        variant="secondary"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Pending Comments ({pendingComments.length})
              </h2>
              
              {pendingComments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">No pending comments</p>
                  <p className="text-sm">All comments have been reviewed</p>
                </div>
              ) : (
                pendingComments.map((comment) => (
                  <motion.div
                    key={`${comment.postId}-${comment.commentIndex}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            {comment.topicTitle}
                          </span>
                          <span className="text-sm text-gray-500">by {comment.author}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">On post: {comment.postContent}</p>
                        <p className="text-sm text-gray-400">{comment.createdAt}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{comment.content}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveComment(comment.postId, comment.commentIndex)}
                        variant="primary"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectComment(comment.postId, comment.commentIndex)}
                        variant="secondary"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
