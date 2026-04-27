import React, { useState } from 'react'
import { Camera, Save, Lock } from 'lucide-react'
import './AdminProfile.css'

const AdminProfile = () => {
  const adminName = localStorage.getItem('adminName') || 'Administrator'
  
  const [formData, setFormData] = useState({
    firstName: adminName.split(' ')[0] || 'Admin',
    lastName: adminName.split(' ')[1] || '',
    email: 'admin@browniebliss.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    
    // Update local storage with new name if changed
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    localStorage.setItem('adminName', fullName)
    
    alert('Profile updated successfully!')
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    window.location.reload() // Quick way to update the sidebar name
  }

  const getInitial = () => {
    return formData.firstName.charAt(0).toUpperCase()
  }

  return (
    <div className="admin-profile">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Profile Settings</h1>
      </div>

      <div className="profile-container">
        <div className="profile-header-bg"></div>
        
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {getInitial()}
            </div>
            <div className="profile-avatar-edit">
              <Camera size={16} />
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
            <button type="submit" className="admin-btn-primary">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProfile
