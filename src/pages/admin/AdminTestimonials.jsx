import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Star } from 'lucide-react'
import './AdminTestimonials.css'

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Emily Chen', rating: 5, text: 'The Triple Chocolate Fudgy brownies are out of this world! Absolute perfection.', date: '2026-04-20', status: 'approved' },
    { id: 2, name: 'Michael Thompson', rating: 4, text: 'Great packaging and arrived fresh. The dream cake was slightly too sweet for me but very good quality.', date: '2026-04-18', status: 'approved' },
    { id: 3, name: 'Jessica Alba', rating: 5, text: 'I ordered the gift box for my mother\'s birthday and she literally cried. Thank you Brownie Bliss!', date: '2026-04-15', status: 'approved' },
    { id: 4, name: 'David Smith', rating: 5, text: 'Best vegan desserts I have ever had. You cannot even tell they are vegan.', date: '2026-04-12', status: 'pending' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    rating: '5',
    text: '',
    status: 'approved'
  })

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        name: testimonial.name,
        rating: testimonial.rating.toString(),
        text: testimonial.text,
        status: testimonial.status
      })
    } else {
      setEditingTestimonial(null)
      setFormData({
        name: '',
        rating: '5',
        text: '',
        status: 'approved'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTestimonial(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingTestimonial) {
      setTestimonials(testimonials.map(t => 
        t.id === editingTestimonial.id ? { ...t, ...formData, rating: parseInt(formData.rating) } : t
      ))
    } else {
      setTestimonials([{
        id: testimonials.length + 1,
        ...formData,
        rating: parseInt(formData.rating),
        date: new Date().toISOString().split('T')[0]
      }, ...testimonials])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter(t => t.id !== id))
    }
  }

  const renderStars = (rating) => {
    return Array(rating).fill('★').join('')
  }

  return (
    <div className="admin-testimonials">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Testimonials</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by customer name or review text..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review Text</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td>
                  <span className="testimonial-author">{testimonial.name}</span>
                </td>
                <td>
                  <span className="testimonial-rating">{renderStars(testimonial.rating)}</span>
                </td>
                <td>
                  <span className="testimonial-text">"{testimonial.text}"</span>
                </td>
                <td>{new Date(testimonial.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${testimonial.status === 'approved' ? 'completed' : 'pending'}`}>
                    {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleOpenModal(testimonial)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(testimonial.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTestimonials.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No testimonials found matching your search.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Review Text</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                    placeholder="Enter the customer's review here..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingTestimonial ? 'Update' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTestimonials
