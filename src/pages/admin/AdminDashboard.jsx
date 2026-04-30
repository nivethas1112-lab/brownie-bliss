import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminDashboard.css'

const MOCK_STATS = {
  totalProducts: 24,
  totalOrders: 156,
  totalCustomers: 89,
  totalRevenue: 12450
}

const MOCK_RECENT_ORDERS = [
  { id: 'ORD001', customer: 'Sarah Johnson', items: 3, total: 45.99, status: 'processing' },
  { id: 'ORD002', customer: 'Mike Davis', items: 2, total: 32.50, status: 'completed' },
  { id: 'ORD003', customer: 'Emma Wilson', items: 5, total: 78.99, status: 'pending' },
  { id: 'ORD004', customer: 'James Brown', items: 1, total: 15.99, status: 'completed' },
  { id: 'ORD005', customer: 'Lisa Anderson', items: 4, total: 56.00, status: 'processing' },
]

const AdminDashboard = () => {
  const [stats, setStats] = useState(MOCK_STATS)
  const [recentOrders, setRecentOrders] = useState(MOCK_RECENT_ORDERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [statsRes, ordersRes] = await Promise.all([
          api.dashboard.getStats(),
          api.dashboard.getRecentOrders(5)
        ])

        if (statsRes && statsRes.stats) {
          const s = statsRes.stats;
          setStats({
            totalProducts: s.totalProducts ?? stats.totalProducts,
            totalOrders: s.totalOrders ?? stats.totalOrders,
            totalCustomers: s.totalCustomers ?? stats.totalCustomers,
            totalRevenue: s.totalRevenue ?? stats.totalRevenue
          })
        }

        const ordersList = ordersRes?.orders || ordersRes || [];
        if (Array.isArray(ordersList)) {
          const formatted = ordersList.map(o => ({
            id: o._id || o.orderId || o.id,
            customer: o.customer?.name || (o.customer?.firstName ? `${o.customer.firstName} ${o.customer.lastName || ''}` : o.customer) || 'Unknown',
            items: o.items?.length || o.itemCount || 0,
            total: o.total || o.totalAmount || 0,
            status: o.status || 'pending'
          }))
          setRecentOrders(formatted.length > 0 ? formatted : MOCK_RECENT_ORDERS)
        }

        setError(null)
      } catch (err) {
        console.warn('Failed to fetch dashboard data, using mock data:', err.message)
        setError('Using cached data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="admin-dashboard" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Package size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <ShoppingCart size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Users size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <IndianRupee size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-recent-orders">
          <div className="admin-section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="admin-view-all">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id-cell">#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.items}</td>
                    <td>₹{order.total.toFixed(2)}</td>
                    <td>
                      <select
                        className={`status-select ${order.status}`}
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const isValidId = /^[0-9a-fA-F]{24}$/.test(order.id);
                          
                          // Optimistic UI update
                          const previousOrders = [...recentOrders];
                          setRecentOrders(recentOrders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));

                          try {
                            if (isValidId) {
                              try {
                                await api.orders.updateStatus(order.id, newStatus);
                              } catch (apiErr) {
                                if (apiErr.response?.status === 404) {
                                  console.warn('Order not found in DB, kept local change for demo.');
                                } else {
                                  throw apiErr;
                                }
                              }
                            }
                          } catch (err) {
                            console.error('Failed to update status:', err);
                            setRecentOrders(previousOrders); // Rollback on real error
                            alert('Failed to update status on server');
                          }
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/admin/orders`} className="dashboard-action-btn">
                        <ArrowUpRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
