import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getForumPosts, getForumTopics, loadDemoData, createForumPost, toggleLikePost, addCommentToPost, deleteForumPost, deletePostComment } from '../services/api'
import type { ForumPost, ForumTopic } from '../types'
import Button from '../components/Button'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'

export default function Forum() {
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [active, setActive] = useState<ForumTopic | null>(null)
  const [query, setQuery] = useState('')
  const [reply, setReply] = useState('')
  const [commentInputs, setCommentInputs] = useState<Record<string,string>>({})
  usePageTitle('CREA • Forum')
  const { user } = useAuth()

  useEffect(() => {
    (async () => {
      await loadDemoData()
      const ts = await getForumTopics()
      setTopics(ts)
    })()
  }, [])
  useEffect(() => { if (active) getForumPosts(active.id).then(setPosts) }, [active])

  const filtered = useMemo(() => {
    if (!query) return topics
    const q = query.toLowerCase()
    return topics.filter(t => t.title.toLowerCase().includes(q))
  }, [topics, query])

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold !text-white" style={{ color: 'white' }}>Discussion Forum</h1>
          </div>
          <p className="text-white/90 text-lg">Connect, collaborate, and share knowledge with fellow railway engineers</p>
        </div>
        
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Total Topics</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{topics.length}</p>
            </div>
            <div className="p-3 bg-[var(--primary)] rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Active Discussions</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{topics.filter(t => t.replies > 0).length}</p>
            </div>
            <div className="p-3 bg-[var(--accent)] rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Total Replies</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{topics.reduce((sum, t) => sum + t.replies, 0)}</p>
            </div>
            <div className="p-3 bg-[var(--secondary)] rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--primary)]">Discussion Topics</h2>
              <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold px-2.5 py-1 rounded-full">{filtered.length}</span>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                placeholder="Search topics..." 
                value={query} 
                onChange={(e)=>setQuery(e.target.value)} 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>

            {/* Topics List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filtered.map((t, idx) => (
                <motion.button 
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    active?.id === t.id 
                      ? 'bg-[var(--primary)] text-white shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`} 
                  onClick={()=>setActive(t)}
                >
                  <div className={`font-semibold mb-1 ${active?.id === t.id ? 'text-white' : 'text-gray-900'}`}>
                    {t.title}
                  </div>
                  <div className={`text-xs flex items-center gap-2 ${active?.id === t.id ? 'text-white/80' : 'text-gray-500'}`}>
                    <span>By {t.author}</span>
                    <span>•</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`text-xs mt-1 flex items-center gap-1 ${active?.id === t.id ? 'text-white/80' : 'text-gray-600'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span className="font-medium">{t.replies} replies</span>
                  </div>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-sm">No topics found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discussion Area */}
        <div className="lg:col-span-2">
          {!active ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="inline-flex p-4 bg-[var(--primary)] rounded-2xl mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Topic</h3>
              <p className="text-gray-600">Choose a discussion topic from the list to view and participate in the conversation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Topic Header */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--primary)] rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 !text-white" style={{ color: 'white' }}>{active.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Started by <span className="font-semibold">{active.author}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(active.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-xs text-white/80">Replies</div>
                    <div className="text-2xl font-bold !text-white" style={{ color: 'white' }}>{active.replies}</div>
                  </div>
                </div>
              </motion.div>

              {/* Posts */}
              <div className="space-y-4">
                {posts.map((p, idx) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold">
                            {p.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{p.author}</div>
                            <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] rounded-lg transition-colors text-sm font-medium"
                            onClick={async () => {
                              try {
                                if (!active) return
                                await toggleLikePost(active.id, p.id)
                                const refreshed = await getForumPosts(active.id)
                                setPosts(refreshed)
                              } catch (err) {
                                alert((err as Error).message || 'Could not like post')
                              }
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>{p.likesCount ?? 0}</span>
                          </button>
                          {user && (user.role === 'admin' || p.author === user.name) && (
                            <button
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
                              onClick={async () => {
                                if (!active) return
                                if (!confirm('Delete this post?')) return
                                try {
                                  await deleteForumPost(active.id, p.id)
                                  const refreshed = await getForumPosts(active.id)
                                  setPosts(refreshed)
                                } catch (err) {
                                  alert((err as Error).message || 'Could not delete post')
                                }
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">{p.content}</p>

                      {/* Comments Section */}
                      {(p.comments || []).length > 0 && (
                        <div className="space-y-3 mt-4 pt-4 border-t">
                          <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {(p.comments || []).length} Comment{(p.comments || []).length !== 1 ? 's' : ''}
                          </div>
                          {(p.comments || []).map((c, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 border-l-4 border-[var(--primary)]">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {c.author.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700">{c.author}</span>
                                </div>
                                {user && (user.role === 'admin' || c.author === user.name) && (
                                  <button
                                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                                    onClick={async () => {
                                      if (!active) return
                                      if (!confirm('Delete this comment?')) return
                                      try {
                                        await deletePostComment(active.id, p.id, i)
                                        const refreshed = await getForumPosts(active.id)
                                        setPosts(refreshed)
                                      } catch (err) {
                                        alert((err as Error).message || 'Could not delete comment')
                                      }
                                    }}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Form */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-2">
                          <input 
                            value={commentInputs[p.id] || ''} 
                            onChange={(e)=>setCommentInputs(s=>({...s,[p.id]:e.target.value}))} 
                            placeholder="Write a comment..." 
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" 
                          />
                          <Button 
                            onClick={async ()=>{
                              if (!active) return
                              const v = (commentInputs[p.id] || '').trim()
                              if (!v) return
                              try {
                                await addCommentToPost(active.id, p.id, v)
                                const refreshed = await getForumPosts(active.id)
                                setPosts(refreshed)
                                setCommentInputs(s=>({...s,[p.id]:''}))
                              } catch (err) {
                                alert((err as Error).message || 'Could not post comment')
                              }
                            }}
                          >
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* New Reply Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border shadow-sm p-6"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Post a Reply
                </h4>
                <textarea 
                  value={reply} 
                  onChange={(e)=>setReply(e.target.value)} 
                  rows={4} 
                  placeholder={user ? "Share your thoughts..." : "Please login to post a reply"} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none" 
                  disabled={!user}
                />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {user ? 'Be respectful and constructive in your responses' : 'You must be logged in to participate'}
                  </p>
                  <Button 
                    onClick={async ()=>{
                      if (!user) return alert('Please login to post')
                      if (!active) return
                      const v = reply.trim()
                      if (!v) return
                      try {
                        await createForumPost(active.id, v)
                        const refreshed = await getForumPosts(active.id)
                        setPosts(refreshed)
                        setReply('')
                      } catch (err) {
                        alert((err as Error).message || 'Could not post reply')
                      }
                    }} 
                    disabled={!user}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Reply
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
