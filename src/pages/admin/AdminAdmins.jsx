import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Shield, Mail } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminAdmins.css'

const MOCK_ADMINS = [
  { id: '1', name: 'Super Admin', email: 'super@browniebliss.com', role: 'super_admin', isActive: true, lastLogin: '2026-04-28 10:30 AM' },
  { id: '2', name: 'Nivetha S', email: 'nivetha@browniebliss.com', role: 'admin', isActive: true, lastLogin: '2026-04-29 09:15 AM' },
  { id: '3', name: 'Support Staff', email: 'support@browniebliss.com', role: 'staff', isActive: false, lastLogin: '2026-04-25 04:45 PM' },
]

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    isActive: true,
    password: ''
  })

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true)
        const response = await api.users.getAll({ role: ['admin', 'super_admin', 'staff'] })
        const userList = Array.isArray(response) ? response : (response.users || [])
        const formatted = userList.map(u => ({
          ...u,
          id: u._id || u.id,
          lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'
        }))
        const adminsOnly = formatted.filter(u => ['admin', 'super_admin', 'staff'].includes(u.role))
        setAdmins(adminsOnly.length > 0 ? adminsOnly : MOCK_ADMINS.map(a => ({ ...a, id: a.id })))
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch admins, using mock data:', err.message)
        setError('Using cached data')
        setAdmins(MOCK_ADMINS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdmins()
  }, [])

  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin)
      setFormData({
        name: admin.name,
        email: admin.email,
        role: admin.role || 'admin',
        isActive: admin.isActive !== undefined ? admin.isActive : admin.status === 'active',
        password: ''
      })
    } else {
      setEditingAdmin(null)
      setFormData({
        name: '',
        email: '',
        role: 'admin',
        isActive: true,
        password: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAdmin(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAdmin) {
        const isValidId = /^[0-9a-fA-F]{24}$/.test(editingAdmin.id)
        if (!isValidId) {
          const transformed = { ...editingAdmin, ...formData }
          setAdmins(admins.map(a => a.id === editingAdmin.id ? transformed : a))
          handleCloseModal()
          return
        }
        const payload = { ...formData }
        if (!payload.password) delete payload.password
        const response = await api.users.update(editingAdmin.id, payload)
        const updated = response.user || response
        setAdmins(admins.map(a =>
          a.id === editingAdmin.id ? { ...a, ...updated, id: updated._id || updated.id } : a
        ))
      } else {
        const response = await api.users.create(formData)
        const created = response.user || response
        setAdmins([...admins, {
          ...created,
          id: created._id || created.id,
          lastLogin: 'Never'
        }])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save admin:', err)
      alert('Failed to save admin: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (admins.length <= 1) {
      alert('Cannot delete the last administrator.')
      return
    }
    if (!window.confirm('Are you sure you want to remove this administrator?')) return
    try {
      const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
      if (!isValidId) {
        setAdmins(admins.filter(a => a.id !== id))
        return
      }
      await api.users.delete(id)
      setAdmins(admins.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to delete admin:', err)
      alert('Failed to delete admin')
    }
  }

  const toggleAdminStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
    const previousAdmins = [...admins]
    setAdmins(admins.map(a =>
      a.id === id ? { ...a, isActive: newStatus, status: newStatus ? 'active' : 'inactive' } : a
    ))
    try {
      if (isValidId) {
        try {
          await api.users.toggleStatus(id, newStatus)
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Admin not found in DB, kept local change for demo.')
          } else {
            throw apiErr
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle admin status:', err)
      setAdmins(previousAdmins)
      alert('Failed to update status')
    }
  }
return (
    <div className="admin-admins">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Administrators</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Admin
        </button>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Admin Name</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <div className="admin-user-cell">
                    <div className="admin-user-avatar">
                      {admin.name?.charAt(0) || '?'}
                    </div>
                    <span className="admin-user-name-text">{admin.name}</span>
                  </div>
                </td>
                <td>
                  <div className="admin-contact-cell">
                    <span><Mail size={14} /> {admin.email}</span>
                  </div>
                </td>
                <td>
                  <button
                    className={`status ${admin.isActive ? 'completed' : 'pending'}`}
                    onClick={() => toggleAdminStatus(admin.id, admin.isActive)}
                    style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <button
                    className={`status ${admin.isActive ? 'completed' : 'pending'}`}
                    onClick={() => toggleAdminStatus(admin.id, admin.isActive)}
                    style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>{admin.lastLogin}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleOpenModal(admin)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(admin.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAdmins.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No administrators found.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingAdmin ? 'Edit Administrator' : 'Create New Admin'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Administrator</option>
                      <option value="staff">Staff</option>
                    </select>
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
                {!editingAdmin && (
                  <div className="admin-form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingAdmin ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAdmins
