import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Upload, Power } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminBlogs.css'

const MOCK_BLOGS = [
  { id: 1, title: 'The Secret to the Perfect Fudgy Brownie', author: 'Chef Maria', date: '2026-04-20', status: 'published', image: '/assets1/chocolate-walnut-brownie.avif', content: 'Learn the secrets to making the perfect fudgy brownies...' },
  { id: 2, title: '5 Reasons to Choose Vegan Desserts', author: 'Emma Green', date: '2026-04-15', status: 'published', image: '/assets1/64b95a4329858e4bbafc5e84_IMG_3043.jpg', content: 'Vegan desserts are not only delicious but also healthier...' },
  { id: 3, title: 'How to Store Your Dream Cake', author: 'Chef Maria', date: '2026-04-10', status: 'draft', image: '/assets1/redvelvetcake123aws-1-of-1.jpg', content: 'Proper storage ensures your cake stays fresh...' },
  { id: 4, title: 'Summer Special: Mango Roll Cakes', author: 'John Baker', date: '2026-04-05', status: 'published', image: '/assets1/fresh-mango-cake-roll-with-whipped-cream-1-735x735.jpg', content: 'Fresh mango roll cakes are perfect for summer...' },
]

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    status: 'draft',
    image: ''
  })

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true)
        const response = await api.blogs.getAll()
        const blogList = Array.isArray(response) ? response : response.blogs || []
        const formatted = blogList.map(b => ({
          ...b,
          id: b._id || b.id
        }))
        setBlogs(formatted.length > 0 ? formatted : MOCK_BLOGS.map(b => ({ ...b, id: b.id })))
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch blogs, using mock data:', err.message)
        setError('Using cached data')
        setBlogs(MOCK_BLOGS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog)
      setFormData({
        title: blog.title,
        author: blog.author,
        content: blog.content || '',
        status: blog.status,
        image: blog.image
      })
    } else {
      setEditingBlog(null)
      setFormData({
        title: '',
        author: localStorage.getItem('adminName') || 'Admin',
        content: '',
        status: 'draft',
        image: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBlog(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBlog) {
        const isValidId = /^[0-9a-fA-F]{24}$/.test(editingBlog.id)
        if (!isValidId) {
          // Local update for mock/non-ObjectId blogs
          const transformed = {
            ...editingBlog,
            ...formData
          }
          setBlogs(blogs.map(b =>
            b.id === editingBlog.id ? transformed : b
          ))
          handleCloseModal()
          return
        }
        const response = await api.blogs.update(editingBlog.id, formData)
        const updated = response.blog || response
        setBlogs(blogs.map(b =>
          b.id === editingBlog.id ? { ...b, ...updated, id: updated._id || updated.id } : b
        ))
      } else {
        const payload = {
          ...formData,
          date: new Date().toISOString().split('T')[0]
        }
        const response = await api.blogs.create(payload)
        const created = response.blog || response
        setBlogs([{ ...created, id: created._id || created.id }, ...blogs])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save blog:', err)
      alert('Failed to save blog post: ' + (err.response?.data?.message || err.message))
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
    
    // Optimistic UI update
    const previousBlogs = [...blogs]
    setBlogs(blogs.map(b =>
      b.id === id ? { ...b, status: newStatus } : b
    ))

    try {
      if (isValidId) {
        try {
          await api.blogs.update(id, { status: newStatus })
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Blog not found in DB, kept local change for demo.')
          } else {
            throw apiErr
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle blog status:', err)
      setBlogs(previousBlogs) // Rollback on real error
      alert('Failed to update status on server')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    try {
      await api.blogs.delete(id)
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (err) {
      console.error('Failed to delete blog:', err)
      alert('Failed to delete blog')
    }
  }
return (
    <div className="admin-blogs">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Blog Posts</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Write New Post
        </button>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search blogs by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date Published</th>
              <th>Status</th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <span className="blog-title">{blog.title}</span>
                </td>
                <td>
                  <span className="blog-author">{blog.author}</span>
                </td>
                <td>{new Date(blog.date).toLocaleDateString()}</td>
                <td>
                  <button 
                    className={`status ${blog.status === 'published' ? 'completed' : 'pending'}`}
                    onClick={() => toggleStatus(blog.id, blog.status)}
                    style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {blog.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleOpenModal(blog)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(blog.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBlogs.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No blogs found matching your search.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="admin-modal-header">
              <h2>{editingBlog ? 'Edit Blog Post' : 'Write New Post'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Post Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter an engaging title..."
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Cover Image</label>
                  <div
                    className="admin-image-upload"
                    onClick={() => document.getElementById('blog-image-upload').click()}
                    style={formData.image && !formData.image.startsWith('/assets') ? { padding: 0, overflow: 'hidden', border: 'none', height: '200px' } : {}}
                  >
                    {formData.image && !formData.image.startsWith('/assets') ? (
                      <img src={formData.image} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} />
                    ) : (
                      <>
                        <Upload size={24} />
                        <span>Drag & drop or click to upload cover image</span>
                      </>
                    )}
                    <input
                      type="file"
                      id="blog-image-upload"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const fileUrl = URL.createObjectURL(e.target.files[0])
                          setFormData({ ...formData, image: fileUrl })
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Blog Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    placeholder="Write your amazing post here..."
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingBlog ? 'Update Post' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBlogs
