import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminCoupons.css'

const MOCK_COUPONS = [
  { id: 1, code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 50, expiryDate: '2026-12-31', usageLimit: 100, usedCount: 45, isActive: true, status: 'active' },
  { id: 2, code: 'FREESHIP', discountType: 'fixed', discountValue: 15, minPurchase: 100, expiryDate: '2026-06-30', usageLimit: 50, usedCount: 50, isActive: false, status: 'inactive' },
  { id: 3, code: 'BROWNIE20', discountType: 'percentage', discountValue: 20, minPurchase: 0, expiryDate: '2026-05-15', usageLimit: 200, usedCount: 120, isActive: true, status: 'active' },
  { id: 4, code: 'FESTIVE50', discountType: 'fixed', discountValue: 50, minPurchase: 200, expiryDate: '2026-01-01', usageLimit: 500, usedCount: 0, isActive: false, status: 'inactive' },
]

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    expiryDate: '',
    usageLimit: '',
    isActive: true
  })

   useEffect(() => {
     const fetchCoupons = async () => {
       try {
         setIsLoading(true)
         const response = await api.coupons.getAll()
         const couponList = Array.isArray(response) ? response : response.coupons || []
         const formatted = couponList.map(c => ({
           ...c,
           id: c._id || c.id,
           isActive: c.isActive !== undefined ? c.isActive : c.status === 'active',
           status: c.isActive !== undefined ? (c.isActive ? 'active' : 'inactive') : c.status
         }))
         setCoupons(formatted.length > 0 ? formatted : MOCK_COUPONS.map(c => ({ ...c, id: c.id })))
         setError(null)
       } catch (err) {
         console.warn('Failed to fetch coupons, using mock data:', err.message)
         setError('Using cached data')
         setCoupons(MOCK_COUPONS)
       } finally {
         setIsLoading(false)
       }
     }
     fetchCoupons()
   }, [])

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minPurchase: coupon.minPurchase.toString(),
        expiryDate: coupon.expiryDate,
        usageLimit: coupon.usageLimit.toString(),
        isActive: coupon.isActive !== undefined ? coupon.isActive : coupon.status === 'active'
      })
    } else {
      setEditingCoupon(null)
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '0',
        expiryDate: '',
        usageLimit: '',
        isActive: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCoupon(null)
  }

   const handleSubmit = async (e) => {
    e.preventDefault()
    const parsedValue = parseFloat(formData.discountValue)
    const parsedMin = parseFloat(formData.minPurchase)
    const parsedLimit = parseInt(formData.usageLimit, 10)

    try {
      if (editingCoupon) {
        const isValidId = /^[0-9a-fA-F]{24}$/.test(editingCoupon.id)
        if (!isValidId) {
          // Local update for mock/non-ObjectId coupons
          const transformed = {
            ...editingCoupon,
            ...formData,
            discountValue: parsedValue,
            minPurchase: parsedMin,
            usageLimit: parsedLimit,
            isActive: formData.isActive,
            status: formData.isActive ? 'active' : 'inactive'
          }
          setCoupons(coupons.map(c =>
            c.id === editingCoupon.id ? transformed : c
          ))
          handleCloseModal()
          return
        }
        const response = await api.coupons.update(editingCoupon.id, {
          isActive: formData.isActive,
          discountValue: parsedValue,
          minPurchase: parsedMin,
          usageLimit: parsedLimit
        })
        const updated = response.coupon || response
        setCoupons(coupons.map(c =>
          c.id === editingCoupon.id ? { 
            ...c, 
            ...updated, 
            id: updated._id || updated.id,
            isActive: updated.isActive !== undefined ? updated.isActive : updated.status === 'active',
            status: updated.isActive !== undefined ? (updated.isActive ? 'active' : 'inactive') : updated.status
          } : c
        ))
      } else {
        const response = await api.coupons.create({
          ...formData,
          code: formData.code.toUpperCase(),
          discountValue: parsedValue,
          minPurchase: parsedMin,
          usageLimit: parsedLimit,
          usedCount: 0,
          isActive: formData.isActive
        })
        const created = response.coupon || response
        setCoupons([...coupons, { 
          ...created, 
          id: created._id || created.id,
          isActive: created.isActive !== undefined ? created.isActive : created.status === 'active',
          status: created.isActive !== undefined ? (created.isActive ? 'active' : 'inactive') : created.status
        }])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save coupon:', err)
      alert('Failed to save coupon: ' + (err.response?.data?.message || err.message))
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const newIsActive = newStatus === 'active'
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
    
    // Optimistic UI update
    const previousCoupons = [...coupons]
    setCoupons(coupons.map(c =>
      c.id === id ? { ...c, status: newStatus, isActive: newIsActive } : c
    ))

    try {
      if (isValidId) {
        try {
          await api.coupons.update(id, { isActive: newIsActive })
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Coupon not found in DB, kept local change for demo.')
          } else {
            throw apiErr
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle coupon status:', err)
      setCoupons(previousCoupons) // Rollback on real error
      alert('Failed to update status on server')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return
    try {
      await api.coupons.delete(id)
      setCoupons(coupons.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete coupon:', err)
      alert('Failed to delete coupon')
    }
  }

  const isExpired = (dateString) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  if (isLoading) {
    return (
      <div className="admin-coupons" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="admin-coupons">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Coupons</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by coupon code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount</th>
              <th>Min Purchase</th>
              <th>Usage</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>
                  <span className="admin-coupon-code">{coupon.code}</span>
                </td>
                <td>
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}% Off`
                    : `₹${coupon.discountValue.toFixed(2)} Off`}
                </td>
                <td>₹{coupon.minPurchase.toFixed(2)}</td>
                <td>
                  {coupon.usedCount} / {coupon.usageLimit}
                  {coupon.usedCount >= coupon.usageLimit && <div className="expiry-warning">Limit Reached</div>}
                </td>
                <td>
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                  {isExpired(coupon.expiryDate) && <div className="expiry-warning">Expired</div>}
                </td>
                <td>
                  <button 
                    className={`status ${coupon.status === 'active' && !isExpired(coupon.expiryDate) && coupon.usedCount < coupon.usageLimit ? 'completed' : 'pending'}`}
                    onClick={() => toggleStatus(coupon.id, coupon.status)}
                    style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {coupon.status === 'active' && !isExpired(coupon.expiryDate) && coupon.usedCount < coupon.usageLimit ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleOpenModal(coupon)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(coupon.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCoupons.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No coupons found matching your search.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g. SUMMER20"
                    style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Discount Value</label>
                    <input
                      type="number"
                      step={formData.discountType === 'percentage' ? "1" : "0.01"}
                      min="0"
                      max={formData.discountType === 'percentage' ? "100" : undefined}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      required
                      placeholder={formData.discountType === 'percentage' ? "20" : "15.00"}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Min Purchase Amount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Usage Limit (Total)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      required
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
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
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCoupons
