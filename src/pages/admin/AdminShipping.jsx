import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import './AdminShipping.css'

const AdminShipping = () => {
  const [shippingZones, setShippingZones] = useState([
    { id: 1, name: 'Local Delivery (City Center)', regions: 'Downtown, Central, Westside', baseRate: 5.00, freeThreshold: 50.00, estimatedDays: 'Same Day', status: 'active' },
    { id: 2, name: 'Suburban Areas', regions: 'North Hills, East End, South Suburbs', baseRate: 12.00, freeThreshold: 80.00, estimatedDays: '1-2 Days', status: 'active' },
    { id: 3, name: 'National Delivery (Standard)', regions: 'All other states', baseRate: 25.00, freeThreshold: 150.00, estimatedDays: '3-5 Days', status: 'active' },
    { id: 4, name: 'National Delivery (Express)', regions: 'All other states', baseRate: 45.00, freeThreshold: 250.00, estimatedDays: '1-2 Days', status: 'active' },
    { id: 5, name: 'International (Zone 1)', regions: 'Canada, Mexico', baseRate: 80.00, freeThreshold: null, estimatedDays: '7-10 Days', status: 'inactive' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingZone, setEditingZone] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    regions: '',
    baseRate: '',
    freeThreshold: '',
    estimatedDays: '',
    status: 'active'
  })

  const filteredZones = shippingZones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.regions.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (zone = null) => {
    if (zone) {
      setEditingZone(zone)
      setFormData({
        name: zone.name,
        regions: zone.regions,
        baseRate: zone.baseRate.toString(),
        freeThreshold: zone.freeThreshold ? zone.freeThreshold.toString() : '',
        estimatedDays: zone.estimatedDays,
        status: zone.status
      })
    } else {
      setEditingZone(null)
      setFormData({
        name: '',
        regions: '',
        baseRate: '',
        freeThreshold: '',
        estimatedDays: '',
        status: 'active'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingZone(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const parsedRate = parseFloat(formData.baseRate);
    const parsedThreshold = formData.freeThreshold ? parseFloat(formData.freeThreshold) : null;
    
    if (editingZone) {
      setShippingZones(shippingZones.map(z => 
        z.id === editingZone.id 
          ? { ...z, ...formData, baseRate: parsedRate, freeThreshold: parsedThreshold }
          : z
      ))
    } else {
      setShippingZones([...shippingZones, {
        id: shippingZones.length + 1,
        ...formData,
        baseRate: parsedRate,
        freeThreshold: parsedThreshold
      }])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this shipping zone?')) {
      setShippingZones(shippingZones.filter(z => z.id !== id))
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
                <td>${zone.baseRate.toFixed(2)}</td>
                <td>
                  {zone.freeThreshold 
                    ? <span style={{ color: '#2e7d32', fontWeight: 500 }}>${zone.freeThreshold.toFixed(2)}+</span> 
                    : <span style={{ color: '#888' }}>Not Available</span>}
                </td>
                <td>{zone.estimatedDays}</td>
                <td>
                  <span className={`status ${zone.status === 'active' ? 'completed' : 'pending'}`}>
                    {zone.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
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
                    <label>Base Rate ($)</label>
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
                    <label>Free Shipping Threshold ($)</label>
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
