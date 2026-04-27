import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import './AdminCoupons.css'

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 50, expiryDate: '2026-12-31', usageLimit: 100, usedCount: 45, status: 'active' },
    { id: 2, code: 'FREESHIP', discountType: 'fixed', discountValue: 15, minPurchase: 100, expiryDate: '2026-06-30', usageLimit: 50, usedCount: 50, status: 'inactive' },
    { id: 3, code: 'BROWNIE20', discountType: 'percentage', discountValue: 20, minPurchase: 0, expiryDate: '2026-05-15', usageLimit: 200, usedCount: 120, status: 'active' },
    { id: 4, code: 'FESTIVE50', discountType: 'fixed', discountValue: 50, minPurchase: 200, expiryDate: '2026-01-01', usageLimit: 500, usedCount: 0, status: 'inactive' },
  ])

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
    status: 'active'
  })

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
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
        status: coupon.status
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
        status: 'active'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCoupon(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const parsedValue = parseFloat(formData.discountValue);
    const parsedMin = parseFloat(formData.minPurchase);
    const parsedLimit = parseInt(formData.usageLimit);
    
    if (editingCoupon) {
      setCoupons(coupons.map(c => 
        c.id === editingCoupon.id 
          ? { ...c, ...formData, discountValue: parsedValue, minPurchase: parsedMin, usageLimit: parsedLimit }
          : c
      ))
    } else {
      setCoupons([...coupons, {
        id: coupons.length + 1,
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: parsedValue,
        minPurchase: parsedMin,
        usageLimit: parsedLimit,
        usedCount: 0
      }])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id))
    }
  }

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  }

  return (
    <div className="admin-coupons">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Coupons</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Create Coupon
        </button>
      </div>

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
                    : `$${coupon.discountValue.toFixed(2)} Off`}
                </td>
                <td>${coupon.minPurchase.toFixed(2)}</td>
                <td>
                  {coupon.usedCount} / {coupon.usageLimit}
                  {coupon.usedCount >= coupon.usageLimit && <div className="expiry-warning">Limit Reached</div>}
                </td>
                <td>
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                  {isExpired(coupon.expiryDate) && <div className="expiry-warning">Expired</div>}
                </td>
                <td>
                  <span className={`status ${coupon.status === 'active' && !isExpired(coupon.expiryDate) && coupon.usedCount < coupon.usageLimit ? 'completed' : 'pending'}`}>
                    {coupon.status === 'active' && !isExpired(coupon.expiryDate) && coupon.usedCount < coupon.usageLimit ? 'Active' : 'Inactive'}
                  </span>
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
                      <option value="fixed">Fixed Amount ($)</option>
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
                    <label>Min Purchase Amount ($)</label>
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
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
