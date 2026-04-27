import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, 
  ChevronDown, ChevronRight, FolderTree, Ticket, Truck, 
  MessageSquare, FileText, FileEdit, Star, User
} from 'lucide-react'
import './AdminLayout.css'

const AdminLayout = () => {
  const location = useLocation()
  const adminName = localStorage.getItem('adminName') || 'Admin'
  const adminAvatar = localStorage.getItem('adminAvatar') || '/assets/3-brownie-stack-falling-playful-600nw-2723000925-removebg-preview.png'
  
  const [openDropdowns, setOpenDropdowns] = useState({
    catalogs: true,
    coupons: false
  })

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    localStorage.removeItem('adminAvatar')
    window.location.href = '/admin/login'
  }

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { 
      id: 'catalogs', 
      icon: FolderTree, 
      label: 'Catalogs',
      isDropdown: true,
      children: [
        { path: '/admin/categories', label: 'Category' },
        { path: '/admin/products', label: 'Product' },
        { path: '/admin/shipping', label: 'Shipping Info' },
      ]
    },
    { 
      id: 'coupons', 
      icon: Ticket, 
      label: 'Coupons',
      isDropdown: true,
      children: [
        { path: '/admin/coupons', label: 'Manage Coupons' },
        { path: '/admin/coupon-logs', label: 'Coupon Usage Log' },
      ]
    },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
    { path: '/admin/transactions', icon: FileText, label: 'Transaction Report' },
    { path: '/admin/blogs', icon: FileEdit, label: 'Blogs' },
    { path: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    { path: '/admin/customers', icon: Users, label: 'Users' },
    { path: '/admin/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/admin">
            <img src="/assets/3-brownie-stack-falling-playful-600nw-2723000925-removebg-preview.png" alt="Brownie Bliss" />
            <span>Brownie Bliss</span>
          </Link>
        </div>
        
        <div className="admin-nav-wrapper">
          <nav className="admin-nav">
            {menuItems.map((item) => {
              if (item.isDropdown) {
                const isOpen = openDropdowns[item.id]
                const hasActiveChild = item.children.some(child => location.pathname === child.path)
                
                return (
                  <div key={item.id} className="admin-nav-dropdown-container">
                    <div 
                      className={`admin-nav-item dropdown-toggle ${hasActiveChild ? 'child-active' : ''}`}
                      onClick={() => toggleDropdown(item.id)}
                    >
                      <div className="admin-nav-item-content">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                    
                    {isOpen && (
                      <div className="admin-nav-dropdown-menu">
                        {item.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`admin-nav-dropdown-item ${location.pathname === child.path ? 'active' : ''}`}
                          >
                            <div className="dropdown-item-dot"></div>
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <div className="admin-nav-item-content">
                     <item.icon size={20} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <Link to="/admin/profile" className="admin-user" style={{ textDecoration: 'none' }}>
            <div 
              className="admin-user-avatar"
              style={adminAvatar ? { backgroundImage: `url("${adminAvatar}")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', color: 'transparent', backgroundColor: 'var(--pink-accent)' } : {}}
            >
              {!adminAvatar && adminName.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name" style={{ color: 'white' }}>{adminName}</span>
              <span className="admin-user-role" style={{ color: 'rgba(255,255,255,0.7)' }}>Administrator</span>
            </div>
          </Link>
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
