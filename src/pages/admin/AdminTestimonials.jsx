import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Star } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminTestimonials.css'

const MOCK_TESTIMONIALS = [
  { id: 1, name: 'Emily Chen', rating: 5, text: 'The Triple Chocolate Fudgy brownies are out of this world! Absolute perfection.', date: '2026-04-20', status: 'approved' },
  { id: 2, name: 'Michael Thompson', rating: 4, text: 'Great packaging and arrived fresh. The dream cake was slightly too sweet for me but very good quality.', date: '2026-04-18', status: 'approved' },
  { id: 3, name: 'Jessica Alba', rating: 5, text: 'I ordered the gift box for my mother\'s birthday and she literally cried. Thank you Brownie Bliss!', date: '2026-04-15', status: 'approved' },
  { id: 4, name: 'David Smith', rating: 5, text: 'Best vegan desserts I have ever had. You cannot even tell they are vegan.', date: '2026-04-12', status: 'pending' },
]

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    rating: '5',
    text: '',
    isApproved: true
  })

   useEffect(() => {
     const fetchTestimonials = async () => {
       try {
         setIsLoading(true)
         const response = await api.testimonials.getAll()
         const testimonialList = Array.isArray(response) ? response : response.testimonials || []
         const formatted = testimonialList.map(t => ({
           ...t,
           id: t._id || t.id,
           text: t.text || t.message,
           status: t.isApproved ? 'approved' : (t.status || 'pending'),
           date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : t.date
         }))
         setTestimonials(formatted.length > 0 ? formatted : MOCK_TESTIMONIALS.map(t => ({ ...t, id: t.id })))
         setError(null)
       } catch (err) {
         console.warn('Failed to fetch testimonials, using mock data:', err.message)
         setError('Using cached data')
         setTestimonials(MOCK_TESTIMONIALS)
       } finally {
         setIsLoading(false)
       }
     }
     fetchTestimonials()
   }, [])

  const filteredTestimonials = testimonials.filter(t =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.text?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        name: testimonial.name || '',
        rating: (testimonial.rating ?? '5').toString(),
        text: testimonial.text || '',
        isApproved: testimonial.isApproved !== undefined ? testimonial.isApproved : testimonial.status === 'approved'
      })
    } else {
      setEditingTestimonial(null)
      setFormData({
        name: '',
        rating: '5',
        text: '',
        isApproved: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTestimonial(null)
  }

    const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        rating: parseInt(formData.rating),
        message: formData.text,
        isApproved: formData.isApproved
      }
      console.log('Submitting testimonial payload:', payload)
      
      if (editingTestimonial) {
        const isValidId = /^[0-9a-fA-F]{24}$/.test(editingTestimonial.id)
        if (!isValidId) {
          // Local update for mock/non-ObjectId testimonials
          const transformed = {
            ...editingTestimonial,
            ...payload,
            text: payload.message,
            status: payload.isApproved ? 'approved' : 'pending'
          }
          setTestimonials(testimonials.map(t =>
            t.id === editingTestimonial.id ? transformed : t
          ))
          handleCloseModal()
          return
        }
        const response = await api.testimonials.update(editingTestimonial.id, payload)
        console.log('Update response:', response)
        const updated = response.testimonial || response
        const transformed = {
          ...updated,
          id: updated._id || updated.id,
          text: updated.message || updated.text,
          status: updated.isApproved ? 'approved' : 'pending'
        }
        setTestimonials(testimonials.map(t =>
          t.id === editingTestimonial.id ? { ...t, ...transformed } : t
        ))
      } else {
        const response = await api.testimonials.create(payload)
        console.log('Create response:', response)
        const created = response.testimonial || response
        const transformed = {
          ...created,
          id: created._id || created.id,
          text: created.message || created.text,
          status: created.isApproved ? 'approved' : 'pending',
          date: new Date().toISOString().split('T')[0]
        }
        setTestimonials([transformed, ...testimonials])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save testimonial:', err)
      console.error('Error details:', err.response?.data || err.message)
      alert('Failed to save testimonial: ' + (err.response?.data?.message || err.message))
    }
  }

   const handleDelete = async (id) => {
     if (!window.confirm('Are you sure you want to delete this testimonial?')) return
     try {
       const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
       if (!isValidId) {
         // Local delete for mock/non-ObjectId testimonials
         setTestimonials(testimonials.filter(t => t.id !== id))
         return
       }
       await api.testimonials.delete(id)
       setTestimonials(testimonials.filter(t => t.id !== id))
     } catch (err) {
       console.error('Failed to delete testimonial:', err)
       alert('Failed to delete testimonial')
     }
   }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved'
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
    
    // Optimistic UI update
    const previousTestimonials = [...testimonials]
    setTestimonials(testimonials.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    ))

    try {
      if (isValidId) {
        try {
          await api.testimonials.update(id, { isApproved: newStatus === 'approved' })
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Testimonial not found in DB, kept local change for demo.')
          } else {
            throw apiErr
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle testimonial status:', err)
      setTestimonials(previousTestimonials) // Rollback on real error
      alert('Failed to update status on server')
    }
  }

  const renderStars = (rating) => {
    return Array(rating).fill('★').join('')
  }

  if (isLoading) {
    return (
      <div className="admin-testimonials" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="admin-testimonials">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Testimonials</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

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
                   <button 
                     className={`status ${testimonial.status === 'approved' ? 'completed' : 'pending'}`}
                     onClick={() => toggleStatus(testimonial.id, testimonial.status)}
                     style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                   >
                     {testimonial.status === 'approved' ? 'Approved' : 'Pending'}
                   </button>
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
                       value={formData.isApproved ? 'approved' : 'pending'}
                       onChange={(e) => setFormData({ ...formData, isApproved: e.target.value === 'approved' })}
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
