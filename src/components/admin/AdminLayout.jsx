import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChevronLeft, ShoppingBag, Menu, X } from 'lucide-react'
import './AdminLayout.css'

const AdminLayout = () => {
  const location = useLocation()
  const adminName = localStorage.getItem('adminName') || 'Admin'

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    window.location.href = '/admin/login'
  }

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/cart', icon: ShoppingBag, label: 'Cart' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
  ]

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="admin-layout">
      <button className="admin-menu-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-logo">
          <Link to="/admin" onClick={closeSidebar}>
            <img src="/assets/3-brownie-stack-falling-playful-600nw-2723000925-removebg-preview.png" alt="Brownie Bliss" />
            <span>Brownie Bliss</span>
          </Link>
        </div>
        
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-user-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{adminName}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
