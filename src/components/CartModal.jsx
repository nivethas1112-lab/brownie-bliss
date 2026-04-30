import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/useCartStore.js'
import Loader from './Loader.jsx'

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { items, isLoading, subtotal, updateItem, removeItem } = useCartStore();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await updateItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="cart-overlay" onClick={onClose} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(75, 46, 46, 0.5)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 2500,
            backdropFilter: 'blur(3px)'
          }}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '450px',
                height: '100%',
                backgroundColor: 'var(--white)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loader size="large" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart-overlay" onClick={onClose} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(75, 46, 46, 0.5)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 2500,
          backdropFilter: 'blur(3px)'
        }}>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '450px',
              height: '100%',
              backgroundColor: 'var(--white)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={24} />
                Your Basket
              </h2>
              <button onClick={onClose}><X size={24} /></button>
            </div>

            <div className="cart-items" style={{ flex: 1, overflowY: 'auto' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <ShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 0',
                    borderBottom: '1px solid var(--pink-accent)'
                  }}>
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{item.name}</h4>
                      <p style={{ color: 'var(--brown-secondary)', fontWeight: '700', marginBottom: '0.5rem' }}>
                        ${(item.price || 0).toFixed(2)}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--pink-bg)', padding: '0.3rem 0.6rem', borderRadius: '20px' }}>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: '600' }}>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div style={{ marginTop: '2rem', borderTop: '2px solid var(--pink-accent)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: '1.2rem' }}
                  onClick={() => {
                    onClose()
                    navigate('/checkout')
                  }}
                >
                  Checkout Now
                </button>
                <button
                  onClick={onClose}
                  style={{ width: '100%', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CartModal
