import React, { useState, useEffect } from 'react'
import { Search, Eye, X } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminOrders.css'

const MOCK_ORDERS = [
  { id: 'ORD001', customer: 'Sarah Johnson', email: 'sarah@email.com', items: 3, total: 45.99, status: 'processing', date: '2024-01-15', address: '123 Main St, New York, NY' },
  { id: 'ORD002', customer: 'Mike Davis', email: 'mike@email.com', items: 2, total: 32.50, status: 'completed', date: '2024-01-14', address: '456 Oak Ave, Los Angeles, CA' },
  { id: 'ORD003', customer: 'Emma Wilson', email: 'emma@email.com', items: 5, total: 78.99, status: 'pending', date: '2024-01-14', address: '789 Pine Rd, Chicago, IL' },
  { id: 'ORD004', customer: 'James Brown', email: 'james@email.com', items: 1, total: 15.99, status: 'completed', date: '2024-01-13', address: '321 Elm St, Houston, TX' },
  { id: 'ORD005', customer: 'Lisa Anderson', email: 'lisa@email.com', items: 4, total: 56.00, status: 'processing', date: '2024-01-13', address: '654 Maple Dr, Phoenix, AZ' },
  { id: 'ORD006', customer: 'David Lee', email: 'david@email.com', items: 2, total: 29.99, status: 'cancelled', date: '2024-01-12', address: '987 Cedar Ln, Philadelphia, PA' },
  { id: 'ORD007', customer: 'Jennifer Taylor', email: 'jen@email.com', items: 6, total: 89.50, status: 'pending', date: '2024-01-12', address: '147 Birch Way, San Antonio, TX' },
  { id: 'ORD008', customer: 'Robert Martinez', email: 'rob@email.com', items: 3, total: 42.00, status: 'completed', date: '2024-01-11', address: '258 Spruce St, San Diego, CA' },
]

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const response = await api.orders.getAll()
        const orderList = Array.isArray(response) ? response : response.orders || []
        const formatted = orderList.map(o => ({
          id: o._id || o.id,
          customer: o.customer?.name || (o.customer?.firstName ? `${o.customer.firstName} ${o.customer.lastName || ''}` : o.customer) || 'Guest',
          email: o.customer?.email || o.email || 'N/A',
          items: o.items?.length || o.itemCount || 0,
          total: o.total || o.totalAmount || 0,
          status: o.status || 'pending',
          date: new Date(o.createdAt || o.date).toLocaleDateString(),
          address: o.shippingAddress?.addressLine1 ? `${o.shippingAddress.addressLine1}, ${o.shippingAddress.city}` : o.address || 'No address'
        }))
        setOrders(formatted.length > 0 ? formatted : MOCK_ORDERS.map(o => ({ ...o, id: o.id })))
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch orders, using mock data:', err.message)
        setError('Using cached data')
        setOrders(MOCK_ORDERS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStatus = async (orderId, newStatus) => {
    const isValidId = /^[0-9a-fA-F]{24}$/.test(orderId);
    const previousOrders = [...orders]; // Store for rollback
    try {
      if (isValidId) {
        await api.orders.updateStatus(orderId, newStatus)
      } else {
        console.warn('Updating mock order locally only.');
      }
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (err) {
      console.error('Failed to update order status:', err)
      setOrders(previousOrders) // Rollback
      alert('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107'
      case 'processing': return '#17a2b8'
      case 'completed': return '#28a745'
      case 'cancelled': return '#dc3545'
      default: return '#6c757d'
    }
  }
return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <span className="admin-order-count">Total: {orders.length} orders</span>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by order ID, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td>
                  <div className="order-customer">
                    <span className="customer-name">{order.customer}</span>
                    <span className="customer-email">{order.email}</span>
                  </div>
                </td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td className="order-total">₹{order.total.toFixed(2)}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status), borderColor: getStatusColor(order.status) }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="admin-action-btn view"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Order #{selectedOrder.id}</h2>
              <button className="admin-modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="order-detail-section">
                <h3>Customer Information</h3>
                <div className="order-detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <span>{selectedOrder.customer}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{selectedOrder.email}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Shipping Address</label>
                    <span>{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Order Summary</h3>
                <div className="order-items">
                  <div className="order-item">
                    <span>Chocolate Brownie x 2</span>
                    <span>₹25.98</span>
                  </div>
                  <div className="order-item">
                    <span>Cookie Tub x 1</span>
                    <span>₹22.99</span>
                  </div>
                  <div className="order-item">
                    <span>Delivery Fee</span>
                    <span>₹5.00</span>
                  </div>
                </div>
                <div className="order-total-row">
                  <span>Total</span>
                  <strong>₹{selectedOrder.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  {['pending', 'processing', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      className={`status-btn ${selectedOrder.status === status ? 'active' : ''}`}
                      style={{
                        backgroundColor: selectedOrder.status === status ? getStatusColor(status) : 'transparent',
                        borderColor: getStatusColor(status),
                        color: selectedOrder.status === status ? '#fff' : getStatusColor(status)
                      }}
                      onClick={() => {
                        updateStatus(selectedOrder.id, status)
                        setSelectedOrder({ ...selectedOrder, status })
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
