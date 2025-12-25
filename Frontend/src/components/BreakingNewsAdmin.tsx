import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import Input from './Input'
import Spinner from './Spinner'
import { getAllBreakingNews, createBreakingNews, updateBreakingNews, deleteBreakingNews, toggleBreakingNewsStatus } from '../services/api'
import type { BreakingNews } from '../types'

export default function BreakingNewsAdmin() {
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<BreakingNews | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 5,
    isActive: true,
    expiresDate: '',
    expiresTime: ''
  })

  useEffect(() => {
    loadBreakingNews()
  }, [])

  const loadBreakingNews = async () => {
    setLoading(true)
    try {
      const data = await getAllBreakingNews()
      setBreakingNews(data)
    } catch (error) {
      console.error('Error loading breaking news:', error)
      alert('Failed to load breaking news')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 5,
      isActive: true,
      expiresDate: '',
      expiresTime: ''
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let expiresAt = null
      if (formData.expiresDate && formData.expiresTime) {
        expiresAt = `${formData.expiresDate}T${formData.expiresTime}:00`
      }

      const payload = {
        ...formData,
        expiresAt
      }

      if (editingItem) {
        await updateBreakingNews(editingItem._id, payload)
        alert('Breaking news updated successfully!')
      } else {
        await createBreakingNews(payload)
        alert('Breaking news created successfully!')
      }
      
      resetForm()
      await loadBreakingNews()
    } catch (error) {
      console.error('Error saving breaking news:', error)
      alert('Failed to save breaking news')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: BreakingNews) => {
    let expiresDate = ''
    let expiresTime = ''
    
    if (item.expiresAt) {
      const date = new Date(item.expiresAt)
      expiresDate = date.toISOString().split('T')[0]
      expiresTime = date.toTimeString().slice(0, 5)
    }

    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      priority: item.priority,
      isActive: item.isActive,
      expiresDate,
      expiresTime
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this breaking news?')) return

    setLoading(true)
    try {
      await deleteBreakingNews(id)
      alert('Breaking news deleted successfully!')
      await loadBreakingNews()
    } catch (error) {
      console.error('Error deleting breaking news:', error)
      alert('Failed to delete breaking news')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string) => {
    setLoading(true)
    try {
      await toggleBreakingNewsStatus(id)
      await loadBreakingNews()
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Failed to toggle status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Breaking News Management</h2>
          <p className="text-gray-600 mt-1">Manage urgent announcements and breaking news</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ Add Breaking News'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Breaking News' : 'Create New Breaking News'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Important Announcement"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the breaking news..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority (0-10)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">Higher priority appears first</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Expires At (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={formData.expiresDate}
                    onChange={(e) => setFormData({ ...formData, expiresDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={formData.expiresTime}
                    onChange={(e) => setFormData({ ...formData, expiresTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible to users)
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && breakingNews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Spinner size={24} />
                      <p className="text-gray-500 mt-2">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : breakingNews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No breaking news found. Create one to get started!
                  </td>
                </tr>
              ) : (
                breakingNews.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.priority >= 8 ? 'bg-red-100 text-red-800' :
                        item.priority >= 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(item._id)}
                        disabled={loading}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.expiresAt 
                        ? new Date(item.expiresAt).toLocaleString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-[var(--primary)] hover:text-[#19417d] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
