import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import './AdminCategories.css'

const AdminCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Brownies', description: 'Rich, fudgy chocolate brownies', itemsCount: 15, status: 'active', icon: '🍫' },
    { id: 2, name: 'Dream Cake', description: 'Multi-layered chocolate dream cakes', itemsCount: 8, status: 'active', icon: '🎂' },
    { id: 3, name: 'Jar Cakes', description: 'Delicious cakes served in glass jars', itemsCount: 12, status: 'active', icon: '🧁' },
    { id: 4, name: 'Cookies', description: 'Freshly baked soft and chewy cookies', itemsCount: 10, status: 'active', icon: '🍪' },
    { id: 5, name: 'Vegans', description: '100% plant-based vegan desserts', itemsCount: 6, status: 'active', icon: '🌱' },
    { id: 6, name: 'Roll Cakes', description: 'Soft sponge cakes rolled with cream', itemsCount: 5, status: 'active', icon: '🥮' },
    { id: 7, name: 'Cupcakes', description: 'Bite-sized decorated mini cakes', itemsCount: 20, status: 'active', icon: '🧁' },
    { id: 8, name: 'Gift Boxes', description: 'Curated premium dessert assortments', itemsCount: 4, status: 'active', icon: '🎁' },
    { id: 9, name: 'Tubs', description: 'Family-sized dessert tubs', itemsCount: 7, status: 'active', icon: '🍨' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '✨',
    status: 'active'
  })

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
        status: category.status
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        icon: '✨',
        status: 'active'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, ...formData }
          : c
      ))
    } else {
      setCategories([...categories, {
        id: categories.length + 1,
        ...formData,
        itemsCount: 0 // New category starts with 0 items
      }])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id))
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
              <th>Items Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>
                  <div className="admin-category-cell">
                    <div className="admin-category-icon">
                      {category.icon}
                    </div>
                    <span className="admin-category-name">{category.name}</span>
                  </div>
                </td>
                <td>{category.description}</td>
                <td>{category.itemsCount} products</td>
                <td>
                  <span className={`status ${category.status === 'active' ? 'completed' : 'pending'}`}>
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
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
                    <label>Icon (Emoji)</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      required
                      placeholder="e.g. 🍫"
                      maxLength={5}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
