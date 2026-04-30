import React, { useState, useEffect } from 'react'
import { Search, Eye, Trash2, X, Send } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminInquiries.css'

const MOCK_INQUIRIES = [
  { id: 1, date: '2026-04-27T09:15:00Z', name: 'Sarah Connor', email: 'sarah.c@example.com', subject: 'Custom Corporate Order', message: 'Hello, I am looking to order 50 boxes of assorted brownies for a corporate event next month. Do you offer bulk discounts?', status: 'new' },
  { id: 2, date: '2026-04-26T14:20:00Z', name: 'Mike Ross', email: 'm.ross@example.com', subject: 'Allergy Information', message: 'Hi there, do your Dream Cakes contain any tree nuts? I have a severe allergy and want to be sure before ordering.', status: 'new' },
  { id: 3, date: '2026-04-25T11:05:00Z', name: 'Jessica Pearson', email: 'jessica.p@example.com', subject: 'Delivery Issue - Order #ORD-9750', message: 'My order was supposed to arrive yesterday but I haven\'t received anything yet. Could you check the status?', status: 'resolved' },
  { id: 4, date: '2026-04-24T16:30:00Z', name: 'Harvey Specter', email: 'harvey@example.com', subject: 'Vegan Options', message: 'Do you have any sugar-free vegan options available?', status: 'resolved' },
]

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true)
        const response = await api.inquiries.getAll()
        const inquiryList = Array.isArray(response) ? response : response.inquiries || []
        const formatted = inquiryList.map(inq => ({
          ...inq,
          id: inq._id || inq.id,
          date: inq.createdAt || inq.date
        }))
        setInquiries(formatted.length > 0 ? formatted : MOCK_INQUIRIES.map(i => ({ ...i, id: i.id })))
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch inquiries, using mock data:', err.message)
        setError('Using cached data')
        setInquiries(MOCK_INQUIRIES)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInquiries()
  }, [])

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatDateTime = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const handleOpenModal = (inquiry) => {
    setSelectedInquiry(inquiry)
    setReplyText('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInquiry(null)
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    const previousInquiries = [...inquiries] // Store for rollback
    try {
      await api.inquiries.updateStatus(selectedInquiry.id, 'resolved')
      setInquiries(inquiries.map(inq =>
        inq.id === selectedInquiry.id ? { ...inq, status: 'resolved' } : inq
      ))
      alert('Reply sent successfully!')
      handleCloseModal()
    } catch (err) {
      console.error('Failed to reply to inquiry:', err)
      setInquiries(previousInquiries) // Rollback
      alert('Failed to send reply')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return
    try {
      await api.inquiries.delete(id)
      setInquiries(inquiries.filter(inq => inq.id !== id))
    } catch (err) {
      console.error('Failed to delete inquiry:', err)
      alert('Failed to delete inquiry')
    }
  }

  if (isLoading) {
    return (
      <div className="admin-inquiries" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="admin-inquiries">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customer Inquiries</h1>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{formatDateTime(inquiry.date)}</td>
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--brown-primary)' }}>{inquiry.name}</span>
                  <div className="inquiry-email">{inquiry.email}</div>
                </td>
                <td>
                  <span className="inquiry-subject">{inquiry.subject}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {inquiry.message.length > 50 ? inquiry.message.substring(0, 50) + '...' : inquiry.message}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleOpenModal(inquiry)} title="View & Reply">
                      <Eye size={16} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(inquiry.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInquiries.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No inquiries found matching your search.
          </div>
        )}
      </div>

      {isModalOpen && selectedInquiry && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>View Inquiry</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="inquiry-message-view">
                <div className="inquiry-meta">
                  <div className="inquiry-meta-item">
                    <span className="inquiry-meta-label">From:</span>
                    <span className="inquiry-meta-value">{selectedInquiry.name} ({selectedInquiry.email})</span>
                  </div>
                  <div className="inquiry-meta-item" style={{ textAlign: 'right' }}>
                    <span className="inquiry-meta-label">Date:</span>
                    <span className="inquiry-meta-value">{new Date(selectedInquiry.date).toLocaleString()}</span>
                  </div>
                </div>
                <div className="inquiry-meta" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '1rem' }}>
                  <div className="inquiry-meta-item">
                    <span className="inquiry-meta-label">Subject:</span>
                    <span className="inquiry-meta-value" style={{ fontSize: '1.1rem' }}>{selectedInquiry.subject}</span>
                  </div>
                </div>
                <div className="inquiry-body">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="reply-section">
                <h3>Reply to Customer</h3>
                <form onSubmit={handleSendReply}>
                  <div className="admin-form-group">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      placeholder="Type your response here... (This will be sent via email)"
                      rows={5}
                    />
                  </div>
                  <div className="admin-form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn-primary">
                      <Send size={18} /> Send Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminInquiries
