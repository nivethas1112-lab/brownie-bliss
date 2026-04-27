import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import './AdminLogin.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState({ email: false, password: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Oh no! Please fill in all fields')
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      if (email === 'admin@browniebliss.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'sample-token-123')
        localStorage.setItem('adminName', 'Admin')
        navigate('/admin')
      } else {
        setError('Oops! Wrong credentials')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="admin-login-page">
      <div className="login-bg-decoration">
        <div className="floating-brownie brownie-1"></div>
        <div className="floating-brownie brownie-2"></div>
        <div className="floating-brownie brownie-3"></div>
        <div className="floating-sparkle sparkle-1"><Sparkles size={20} /></div>
        <div className="floating-sparkle sparkle-2"><Sparkles size={16} /></div>
        <div className="floating-sparkle sparkle-3"><Sparkles size={14} /></div>
      </div>

      <motion.div 
        className="admin-login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="admin-login-header">
          <motion.div 
            className="login-logo-container"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img 
              src="/assets/3-brownie-stack-falling-playful-600nw-2723000925-removebg-preview.png" 
              alt="Brownie Bliss" 
              className="login-logo"
            />
          </motion.div>
          <motion.h1 
            className="login-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Brownie Bliss
          </motion.h1>
          <motion.p 
            className="login-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="subtitle-icon">✨</span>
            Admin Dashboard
            <span className="subtitle-icon">✨</span>
          </motion.p>
        </div>

        <motion.form 
          className="admin-login-form" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {error && (
            <motion.div 
              className="admin-error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="error-icon">🥺</span>
              {error}
            </motion.div>
          )}
          
          <motion.div 
            className={`admin-form-group ${isFocused.email ? 'focused' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label>
              <span className="label-icon">📧</span>
              Email
            </label>
            <div className="admin-input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                onFocus={() => setIsFocused({ ...isFocused, email: true })}
                onBlur={() => setIsFocused({ ...isFocused, email: false })}
              />
            </div>
          </motion.div>

          <motion.div 
            className={`admin-form-group ${isFocused.password ? 'focused' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label>
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="admin-input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Shh... secret password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                onFocus={() => setIsFocused({ ...isFocused, password: true })}
                onBlur={() => setIsFocused({ ...isFocused, password: false })}
              />
              <motion.button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className="admin-remember-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="admin-checkbox">
              <input type="checkbox" />
              <span className="checkbox-custom"></span>
              <span>Remember me</span>
            </label>
          </motion.div>

          <motion.button 
            type="submit" 
            className="admin-login-btn"
            disabled={isLoading}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(75, 46, 46, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              <>
                <span className="btn-icon">🍫</span>
                Let's Go!
                <span className="btn-icon">🍫</span>
              </>
            )}
          </motion.button>

        </motion.form>
      </motion.div>
    </div>
  )
}

export default AdminLogin
