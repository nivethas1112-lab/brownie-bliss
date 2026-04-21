import React from 'react'
import { motion } from 'framer-motion'

const Reveal = ({ children, width = "100%", delay = 0.2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      style={{ width }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
