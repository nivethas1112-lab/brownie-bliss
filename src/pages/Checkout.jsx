import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, MapPin, User } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore.js'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCartStore()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const deliveryFee = useMemo(() => (items.length > 0 ? 49 : 0), [items.length])
  const grandTotal = subtotal + deliveryFee

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    try {
      await clearCart()
      alert('Order placed successfully!')
      navigate('/')
    } catch (error) {
      alert('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brown-primary)' }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 style={{ marginBottom: '1.5rem' }}>Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Contact Details
            </h3>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <input placeholder="Full Name" style={{ padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--pink-accent)' }} />
              <input placeholder="Email Address" style={{ padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--pink-accent)' }} />
              <input placeholder="Phone Number" style={{ padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--pink-accent)' }} />
            </div>

            <h3 style={{ margin: '1.5rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Delivery Address
            </h3>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <textarea rows={3} placeholder="Street Address" style={{ padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--pink-accent)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <input placeholder="City" style={{ padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--pink-accent)' }} />
                <input placeholder="Pincode" style={{ padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--pink-accent)' }} />
              </div>
            </div>
          </div>

          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
            <div style={{ display: 'grid', gap: '0.8rem', marginBottom: '1rem' }}>
              {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>}
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--pink-accent)', paddingTop: '1rem', display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || items.length === 0}
            >
              <CreditCard size={18} />
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
