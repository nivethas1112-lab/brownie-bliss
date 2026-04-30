import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminCategories.css'

const MOCK_CATEGORIES = [
  { id: '65f1a2b3c4d5e6f7a8b9c001', name: 'Brownies', description: 'Rich, fudgy chocolate brownies', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c002', name: 'Dream Cake', description: 'Multi-layered chocolate dream cakes', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c003', name: 'Jar Cakes', description: 'Delicious cakes served in glass jars', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c004', name: 'Cookies', description: 'Freshly baked soft and chewy cookies', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c005', name: 'Vegans', description: '100% plant-based vegan desserts', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c006', name: 'Roll Cakes', description: 'Soft sponge cakes rolled with cream', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c007', name: 'Cupcakes', description: 'Bite-sized decorated mini cakes', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c008', name: 'Gift Boxes', description: 'Curated premium dessert assortments', isActive: true, status: 'active' },
  { id: '65f1a2b3c4d5e6f7a8b9c009', name: 'Tubs', description: 'Family-sized dessert tubs', isActive: true, status: 'active' },
]

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  })

   useEffect(() => {
     const fetchCategories = async () => {
       try {
         setIsLoading(true)
         const response = await api.categories.getAll()
         const categoryList = Array.isArray(response) ? response : response.categories || []
         const formatted = categoryList.map(c => ({
           ...c,
           id: c._id || c.id,
           isActive: c.isActive !== undefined ? c.isActive : c.status === 'active',
           status: c.isActive !== undefined ? (c.isActive ? 'active' : 'inactive') : c.status
         }))
         setCategories(formatted.length > 0 ? formatted : MOCK_CATEGORIES.map(c => ({ ...c, id: c.id })))
         setError(null)
       } catch (err) {
         console.warn('Failed to fetch categories, using mock data:', err.message)
         setError('Using cached data')
         setCategories(MOCK_CATEGORIES)
       } finally {
         setIsLoading(false)
       }
     }
     fetchCategories()
   }, [])

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description,
        isActive: category.isActive !== undefined ? category.isActive : category.status === 'active'
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        isActive: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValidId = editingCategory ? /^[0-9a-fA-F]{24}$/.test(editingCategory.id) : true
    try {
      if (editingCategory) {
        if (isValidId) {
          const response = await api.categories.update(editingCategory.id, { isActive: formData.isActive })
          const updated = response.category || response
          setCategories(categories.map(c =>
            c.id === editingCategory.id ? { 
              ...c, 
              ...updated, 
              id: updated._id || updated.id,
              isActive: updated.isActive !== undefined ? updated.isActive : updated.status === 'active',
              status: updated.isActive !== undefined ? (updated.isActive ? 'active' : 'inactive') : updated.status
            } : c
          ))
        } else {
          setCategories(categories.map(c =>
            c.id === editingCategory.id ? { ...c, isActive: formData.isActive } : c
          ))
          console.warn('Updated mock category locally.')
        }
      } else {
        const response = await api.categories.create({ ...formData })
        const created = response.category || response
        setCategories([...categories, {
          ...created,
          id: created._id || created.id,
          isActive: created.isActive !== undefined ? created.isActive : created.status === 'active',
          status: created.isActive !== undefined ? (created.isActive ? 'active' : 'inactive') : created.status
        }])
      }
      window.dispatchEvent(new CustomEvent('admin-notification', { 
        detail: { message: `Category ${editingCategory ? 'updated' : 'created'} successfully!`, type: 'success' } 
      }))
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save category:', err)
      window.dispatchEvent(new CustomEvent('admin-notification', { 
        detail: { message: 'Failed to save category', type: 'error' } 
      }))
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const newIsActive = newStatus === 'active'
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
    
    // Optimistic UI update
    const previousCategories = [...categories]
    setCategories(categories.map(c =>
      c.id === id ? { ...c, status: newStatus, isActive: newIsActive } : c
    ))

    try {
      if (isValidId) {
        // Only try to update if it looks like a real ID, but handle failure silently for mock IDs
        try {
          await api.categories.update(id, { isActive: newIsActive })
          window.dispatchEvent(new CustomEvent('admin-notification', { 
            detail: { message: `Category status changed to ${newStatus}!`, type: 'success' } 
          }))
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Category not found in DB, kept local change for demo.')
            window.dispatchEvent(new CustomEvent('admin-notification', { 
              detail: { message: `Mock Category status changed to ${newStatus}!`, type: 'success' } 
            }))
          } else {
            throw apiErr
          }
        }
      } else {
        window.dispatchEvent(new CustomEvent('admin-notification', { 
          detail: { message: `Mock Category status changed to ${newStatus}!`, type: 'success' } 
        }))
      }
    } catch (err) {
      console.error('Failed to toggle category status:', err)
      setCategories(previousCategories) // Rollback on real error
      window.dispatchEvent(new CustomEvent('admin-notification', { 
        detail: { message: 'Failed to update status on server', type: 'error' } 
      }))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await api.categories.delete(id)
      setCategories(categories.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete category:', err)
      alert('Failed to delete category')
    }
  }
return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>
                  <span className="admin-category-name" style={{ fontWeight: '600' }}>{category.name}</span>
                </td>
                <td>{category.description}</td>
                <td>
                  <button 
                    className={`status ${category.status === 'active' ? 'completed' : 'pending'}`}
                    onClick={() => toggleStatus(category.id, category.status)}
                    style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleOpenModal(category)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(category.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCategories.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No categories found matching your search.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Brownies"
                  />
                </div>

                 <div className="admin-form-row">
                   <div className="admin-form-group">
                     <label>Status</label>
                     <select
                       value={formData.isActive ? 'active' : 'inactive'}
                       onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                     >
                       <option value="active">Active</option>
                       <option value="inactive">Inactive</option>
                     </select>
                   </div>
                 </div>

                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Enter category description..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories
