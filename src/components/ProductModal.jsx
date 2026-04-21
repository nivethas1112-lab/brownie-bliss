import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, ShoppingBag } from 'lucide-react'

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(75, 46, 46, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '2rem',
          backdropFilter: 'blur(5px)'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content card"
            style={{
              maxWidth: '900px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1fr) 1fr',
              gap: '2rem',
              padding: '1rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <button 
              onClick={onClose} 
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                background: 'var(--white)',
                padding: '0.5rem',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <X size={20} />
            </button>

            <div className="modal-image-container">
              <img 
                src={product.img} 
                alt={product.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)'
                }} 
              />
            </div>

            <div className="modal-info" style={{ padding: '2rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ 
                  background: 'var(--pink-accent)', 
                  color: 'var(--brown-primary)', 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700' 
                }}>
                  Premium Choice
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <Star size={16} fill="var(--brown-primary)" /> {product.rating}
                </span>
              </div>

              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h2>
              <p style={{ color: 'var(--brown-secondary)', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>{product.price}</p>
              
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Description</h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                  Our signature {product.name.toLowerCase()} is crafted with 70% dark Belgian chocolate and organic butter, ensuring a rich, fudgy experience in every bite. Perfectly balanced with a pinch of sea salt.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Ingredients</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cocoa, Butter, Sugar, Flour, Eggs, Salt.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Delivery</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Baked fresh & shipped within 24 hours.</p>
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={() => {
                  onAddToCart()
                  onClose()
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.2rem' }}
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProductModal
