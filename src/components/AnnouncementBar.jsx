import React from 'react'
import { motion } from 'framer-motion'

const AnnouncementBar = () => {
  return (
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: 'var(--brown-secondary)',
        color: 'var(--white)',
        textAlign: 'center',
        padding: '0.5rem 0',
        fontSize: '0.85rem',
        fontWeight: '600',
        letterSpacing: '1px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1100
      }}
    >
      <div className="container">
        ✨ FREE SHIPPING ON ALL GIFT BOX ORDERS THIS WEEK! ✨
      </div>
    </motion.div>
  )
}

export default AnnouncementBar
