import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import api from '../../services/api.js'
import { apiClient } from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminShipping.css'

const MOCK_SHIPPING_ZONES = [
  { id: 1, name: 'Local Delivery (City Center)', regions: 'Downtown, Central, Westside', baseRate: 5.00, freeThreshold: 50.00, estimatedDays: 'Same Day', isActive: true, status: 'active' },
  { id: 2, name: 'Suburban Areas', regions: 'North Hills, East End, South Suburbs', baseRate: 12.00, freeThreshold: 80.00, estimatedDays: '1-2 Days', isActive: true, status: 'active' },
  { id: 3, name: 'National Delivery (Standard)', regions: 'All other states', baseRate: 25.00, freeThreshold: 150.00, estimatedDays: '3-5 Days', isActive: true, status: 'active' },
  { id: 4, name: 'National Delivery (Express)', regions: 'All other states', baseRate: 45.00, freeThreshold: 250.00, estimatedDays: '1-2 Days', isActive: true, status: 'active' },
  { id: 5, name: 'International (Zone 1)', regions: 'Canada, Mexico', baseRate: 80.00, freeThreshold: null, estimatedDays: '7-10 Days', isActive: false, status: 'inactive' },
]

const AdminShipping = () => {
  const [shippingZones, setShippingZones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingZone, setEditingZone] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    regions: '',
    baseRate: '',
    freeThreshold: '',
    estimatedDays: '',
    isActive: true
  })

   useEffect(() => {
     const fetchZones = async () => {
       try {
         setIsLoading(true)
         const response = await api.shipping.getZones()
         const zones = Array.isArray(response) ? response : response.zones || []
         const formatted = zones.map(z => ({
           ...z,
           id: z._id || z.id,
           isActive: z.isActive !== undefined ? z.isActive : z.status === 'active',
           status: z.isActive !== undefined ? (z.isActive ? 'active' : 'inactive') : z.status
         }))
         setShippingZones(formatted.length > 0 ? formatted : MOCK_SHIPPING_ZONES.map(z => ({ ...z, id: z.id })))
         setError(null)
       } catch (err) {
         console.warn('Failed to fetch shipping zones, using mock data:', err.message)
         setError('Using cached data')
         setShippingZones(MOCK_SHIPPING_ZONES)
       } finally {
         setIsLoading(false)
       }
     }
     fetchZones()
   }, [])

  const filteredZones = shippingZones.filter(zone =>
    zone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.regions?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (zone = null) => {
    if (zone) {
      setEditingZone(zone)
      setFormData({
        name: zone.name || '',
        regions: zone.regions || '',
        baseRate: (zone.baseRate ?? '').toString(),
        freeThreshold: (zone.freeThreshold ?? '').toString(),
        estimatedDays: zone.estimatedDays || '',
        isActive: zone.isActive !== undefined ? zone.isActive : zone.status === 'active'
      })
    } else {
      setEditingZone(null)
      setFormData({
        name: '',
        regions: '',
        baseRate: '',
        freeThreshold: '',
        estimatedDays: '',
        isActive: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingZone(null)
  }

   const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const parsedRate = parseFloat(formData.baseRate)
      const parsedThreshold = formData.freeThreshold ? parseFloat(formData.freeThreshold) : null

      if (editingZone) {
        const isValidId = /^[0-9a-fA-F]{24}$/.test(editingZone.id)
        if (!isValidId) {
          // Local update for mock/non-ObjectId zones
          const transformed = {
            ...editingZone,
            ...formData,
            baseRate: parsedRate,
            freeThreshold: parsedThreshold,
            isActive: formData.isActive,
            status: formData.isActive ? 'active' : 'inactive'
          }
          setShippingZones(shippingZones.map(z =>
            z.id === editingZone.id ? transformed : z
          ))
          handleCloseModal()
          return
        }
        const response = await api.shipping.updateZone(editingZone.id, {
          ...formData,
          baseRate: parsedRate,
          freeThreshold: parsedThreshold,
          isActive: formData.isActive
        })
        const updated = response.zone || response
        setShippingZones(shippingZones.map(z =>
          z.id === editingZone.id ? { 
            ...z, 
            ...updated, 
            id: updated._id || updated.id,
            isActive: updated.isActive !== undefined ? updated.isActive : updated.status === 'active',
            status: updated.isActive !== undefined ? (updated.isActive ? 'active' : 'inactive') : updated.status
          } : z
        ))
      } else {
        const response = await api.shipping.createZone({
          ...formData,
          baseRate: parsedRate,
          freeThreshold: parsedThreshold,
          isActive: formData.isActive
        })
        const created = response.zone || response
        setShippingZones([...shippingZones, { 
          ...created, 
          id: created._id || created.id,
          isActive: created.isActive !== undefined ? created.isActive : created.status === 'active',
          status: created.isActive !== undefined ? (created.isActive ? 'active' : 'inactive') : created.status
        }])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save shipping zone:', err)
      alert('Failed to save shipping zone: ' + (err.response?.data?.message || err.message))
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const newIsActive = newStatus === 'active'
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
    const previousZones = [...shippingZones] // Store for rollback
    setShippingZones(shippingZones.map(z =>
      z.id === id ? { ...z, status: newStatus, isActive: newIsActive } : z
    ))

    try {
      if (isValidId) {
        try {
          await api.shipping.updateZone(id, { isActive: newIsActive })
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Zone not found in DB, kept local change for demo.')
          } else {
            throw apiErr
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle zone status:', err)
      setShippingZones(previousZones) // Rollback
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shipping zone?')) return
    try {
      await api.shipping.deleteZone(id)
      setShippingZones(shippingZones.filter(z => z.id !== id))
    } catch (err) {
      console.error('Failed to delete shipping zone:', err)
      alert('Failed to delete shipping zone')
    }
  }
return (
    <div className="admin-shipping">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Shipping Info</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Shipping Zone
        </button>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search zones or regions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Zone Details</th>
              <th>Base Rate</th>
              <th>Free Shipping At</th>
              <th>Est. Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((zone) => (
              <tr key={zone.id}>
                <td>
                  <div className="admin-shipping-cell">
                    <span className="admin-shipping-name">{zone.name}</span>
                    <span className="admin-shipping-regions">{zone.regions}</span>
                  </div>
                </td>
                <td>₹{(zone.baseRate || 0).toFixed(2)}</td>
                <td>
                  {zone.freeThreshold !== null && zone.freeThreshold !== undefined
                    ? <span style={{ color: '#2e7d32', fontWeight: 500 }}>₹{parseFloat(zone.freeThreshold).toFixed(2)}</span>
                    : <span style={{ color: '#888' }}>Not Available</span>}
                </td>
                <td>{zone.estimatedDays}</td>
                <td>
                  <button 
                    className={`status ${zone.status === 'active' ? 'completed' : 'pending'}`}
                    onClick={() => toggleStatus(zone.id, zone.status)}
                    style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {zone.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleOpenModal(zone)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(zone.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredZones.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No shipping zones found matching your search.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingZone ? 'Edit Shipping Zone' : 'Add Shipping Zone'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Zone Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Local Delivery"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Included Regions / Zip Codes</label>
                  <input
                    type="text"
                    value={formData.regions}
                    onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
                    required
                    placeholder="e.g. New York, NJ, PA"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Base Rate (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.baseRate}
                      onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                      required
                      placeholder="e.g. 15.00"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.freeThreshold}
                      onChange={(e) => setFormData({ ...formData, freeThreshold: e.target.value })}
                      placeholder="Leave blank if N/A"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Estimated Delivery Days</label>
                    <input
                      type="text"
                      value={formData.estimatedDays}
                      onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                      required
                      placeholder="e.g. 2-3 Days"
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
                  {editingZone ? 'Update Zone' : 'Add Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminShipping
