import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 24,
    totalOrders: 156,
    totalCustomers: 89,
    totalRevenue: 12450
  })

  const recentOrders = [
    { id: 'ORD001', customer: 'Sarah Johnson', items: 3, total: 45.99, status: 'processing' },
    { id: 'ORD002', customer: 'Mike Davis', items: 2, total: 32.50, status: 'completed' },
    { id: 'ORD003', customer: 'Emma Wilson', items: 5, total: 78.99, status: 'pending' },
    { id: 'ORD004', customer: 'James Brown', items: 1, total: 15.99, status: 'completed' },
    { id: 'ORD005', customer: 'Lisa Anderson', items: 4, total: 56.00, status: 'processing' },
  ]

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

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
            <DollarSign size={28} />
          </div>
          <div className="admin-stat-content">
            <h3>${stats.totalRevenue.toLocaleString()}</h3>
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
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.items}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-quick-stats">
          <h2>Sales Overview</h2>
          <div className="admin-chart-wrapper">
            <div className="admin-chart-placeholder">
              <div className="admin-chart-bars">
                <div className="chart-bar" style={{ height: '60%' }}><span>Mon</span></div>
                <div className="chart-bar" style={{ height: '80%' }}><span>Tue</span></div>
                <div className="chart-bar" style={{ height: '45%' }}><span>Wed</span></div>
                <div className="chart-bar" style={{ height: '90%' }}><span>Thu</span></div>
                <div className="chart-bar" style={{ height: '70%' }}><span>Fri</span></div>
                <div className="chart-bar" style={{ height: '95%' }}><span>Sat</span></div>
                <div className="chart-bar" style={{ height: '50%' }}><span>Sun</span></div>
              </div>
            </div>
          </div>
          <div className="admin-weekly-summary">
            <div className="summary-item">
              <span>This Week</span>
              <strong>$2,450</strong>
            </div>
            <div className="summary-item">
              <span>vs Last Week</span>
              <strong className="positive"><TrendingUp size={14} /> +12%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
