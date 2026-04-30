import React, { useState } from 'react'
import { Camera, Save, Lock } from 'lucide-react'
import { apiClient } from '../../services/api.js' // Direct axios instance
import './AdminProfile.css'

const AdminProfile = () => {
  const adminName = localStorage.getItem('adminName') || 'Administrator'
  const savedAvatar = localStorage.getItem('adminAvatar') || '/assets/3-brownie-stack-falling-playful-600nw-2723000925-removebg-preview.png'

  const [formData, setFormData] = useState({
    firstName: adminName.split(' ')[0] || 'Admin',
    lastName: adminName.split(' ')[1] || '',
    email: 'admin@browniebliss.com',
    phone: '+1 (555) 123-4567',
    avatar: savedAvatar,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: "Passwords don't match!" })
      return
    }

    setIsLoading(true)

    try {
      // Update profile via API
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      }

      // Only include password if provided
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword
        payload.newPassword = formData.newPassword
      }

      await apiClient.put('/admin/profile', payload)

      // Update local storage
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      localStorage.setItem('adminName', fullName)
      if (formData.avatar) {
        localStorage.setItem('adminAvatar', formData.avatar)
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      console.error('Failed to update profile:', err)
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitial = () => {
    return formData.firstName.charAt(0).toUpperCase()
  }

  return (
    <div className="admin-profile">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Profile Settings</h1>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      <div className="profile-container">
        <div className="profile-header-bg"></div>

        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <div
              className="profile-avatar"
              style={formData.avatar && !formData.avatar.startsWith('/assets')
                ? { backgroundImage: `url("${formData.avatar}")`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' }
                : {}
              }
            >
              {!formData.avatar || formData.avatar.startsWith('/assets') ? getInitial() : ''}
            </div>
            <div
              className="profile-avatar-edit"
              onClick={() => document.getElementById('avatar-upload').click()}
            >
              <Camera size={16} />
              <input
                type="file"
                id="avatar-upload"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      setFormData({ ...formData, avatar: event.target.result })
                    }
                    reader.readAsDataURL(e.target.files[0])
                  }
                }}
              />
            </div>
          </div>
          <h2 className="profile-name">{formData.firstName} {formData.lastName}</h2>
          <span className="profile-role">Super Admin</span>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <h3 className="profile-section-title">Personal Information</h3>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <h3 className="profile-section-title" style={{ marginTop: '2rem' }}>
            <Lock size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }} />
            Security
          </h3>

          <div className="admin-form-group">
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password to make changes"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="admin-btn-primary" disabled={isLoading}>
              <Save size={18} /> {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProfile
