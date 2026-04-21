import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 2 }}
      onAnimationComplete={() => document.body.style.overflow = 'auto'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--brown-primary)',
        color: 'var(--white)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '4px solid var(--pink-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: '800',
          fontFamily: 'Playfair Display, serif',
          marginBottom: '1rem',
        }}
      >
        BB
      </motion.div>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.5rem',
          letterSpacing: '2px',
        }}
      >
        BROWNIE BLISS
      </motion.h2>
    </motion.div>
  )
}

export default Loader
