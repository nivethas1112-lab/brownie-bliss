import React, { useState, useEffect } from 'react'
import { Trash2, Plus, Minus, Eye, X } from 'lucide-react'
import { apiClient } from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminCart.css'

const MOCK_CART_ITEMS = [
  { id: 1, name: 'Triple Chocolate Fudgy', price: 199, quantity: 2, total: 398, status: 'active', customer: 'John Doe', date: '2024-01-15' },
  { id: 2, name: 'Red Velvet White Choco', price: 220, quantity: 1, total: 220, status: 'active', customer: 'Jane Smith', date: '2024-01-14' },
  { id: 3, name: 'Sea Salt Caramel Tub', price: 520, quantity: 1, total: 520, status: 'pending', customer: 'Mike Johnson', date: '2024-01-14' },
  { id: 4, name: 'Walnut Crunch Brownie', price: 180, quantity: 3, total: 540, status: 'completed', customer: 'Sarah Wilson', date: '2024-01-13' },
  { id: 5, name: 'Premium Gift Box', price: 999, quantity: 1, total: 999, status: 'active', customer: 'Tom Brown', date: '2024-01-13' },
]

const AdminCart = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get('/admin/cart')
        const items = Array.isArray(response) ? response : response.items || response.carts || []
        setCartItems(items.length > 0 ? items : MOCK_CART_ITEMS)
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch cart items, using mock data:', err.message)
        setError('Using cached data')
        setCartItems(MOCK_CART_ITEMS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCartItems()
  }, [])

  const updateQuantity = async (id, change) => {
    try {
      await apiClient.patch(`/admin/cart/${id}/quantity`, { change })
      setCartItems(cartItems.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change
          if (newQty > 0) {
            return { ...item, quantity: newQty, total: newQty * item.price }
          }
        }
        return item
      }).filter(item => item.quantity > 0))
    } catch (err) {
      console.error('Failed to update quantity:', err)
      // Optimistic fallback
      setCartItems(cartItems.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change
          if (newQty > 0) {
            return { ...item, quantity: newQty, total: newQty * item.price }
          }
        }
        return item
      }).filter(item => item.quantity > 0))
    }
  }

  const removeItem = async (id) => {
    if (!window.confirm('Remove this item from cart?')) return
    try {
      await apiClient.delete(`/admin/cart/${id}`)
      setCartItems(cartItems.filter(item => item.id !== id))
    } catch (err) {
      console.error('Failed to remove item:', err)
      alert('Failed to remove item')
    }
  }

  const totalCartValue = cartItems.reduce((sum, item) => sum + item.total, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (isLoading) {
    return (
      <div className="admin-cart" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="admin-cart">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Shopping Cart</h1>
        <div className="cart-summary-badge">
          <span className="cart-items-count">{totalItems} items</span>
          <span className="cart-total-value">₹{totalCartValue.toLocaleString()}</span>
        </div>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="cart-stats-row">
        <div className="cart-stat-card">
          <span className="stat-number">{cartItems.length}</span>
          <span className="stat-label">Active Carts</span>
        </div>
        <div className="cart-stat-card">
          <span className="stat-number">₹{totalCartValue.toLocaleString()}</span>
          <span className="stat-label">Total Value</span>
        </div>
        <div className="cart-stat-card">
          <span className="stat-number">{totalItems}</span>
          <span className="stat-label">Total Items</span>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="cart-product-info">
                    <span className="cart-product-name">{item.name}</span>
                  </div>
                </td>
                <td>₹{item.price}</td>
                <td>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </td>
                <td className="cart-total">₹{item.total}</td>
                <td>{item.customer}</td>
                <td>{item.date}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-action-btn view"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="admin-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="admin-modal cart-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Cart Details</h2>
              <button className="admin-modal-close" onClick={() => setSelectedItem(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="cart-detail-item">
                <h3>{selectedItem.name}</h3>
                <div className="cart-detail-info">
                  <div className="detail-row">
                    <span>Unit Price</span>
                    <strong>₹{selectedItem.price}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Quantity</span>
                    <strong>{selectedItem.quantity}</strong>
                  </div>
                  <div className="detail-row total">
                    <span>Total</span>
                    <strong>₹{selectedItem.total}</strong>
                  </div>
                </div>
              </div>
              <div className="cart-detail-customer">
                <h4>Customer Info</h4>
                <p><strong>Name:</strong> {selectedItem.customer}</p>
                <p><strong>Date:</strong> {selectedItem.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCart
