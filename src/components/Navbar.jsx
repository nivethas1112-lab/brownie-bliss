import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Menu, X, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../stores/useCartStore.js'
import './Navbar.css'

const Navbar = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Get cart item count from global store
  const totalItems = useCartStore((state) => state.totalItems)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categoryGroups = [
    {
      name: 'Brownies',
      items: ['Dream Cake', 'Jar Cake']
    },
    {
      name: 'Tubs',
      items: ['Cookies', 'Vegan']
    },
    {
      name: 'Cake',
      items: ['Roll Cake', 'Cup Cake']
    },
    {
      name: 'Gift Boxes',
      items: null
    }
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img src="/assets/3-brownie-stack-falling-playful-600nw-2723000925-removebg-preview.png" alt="Brownie Bliss Logo" className="logo-img" />
          <span>Brownie Bliss</span>
        </Link>

        <div className="nav-right desktop-menu">
          <Link to="/" className="nav-link">Home</Link>

          <div className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => setActiveDropdown(activeDropdown === 'main' ? null : 'main')}
              onMouseEnter={() => setActiveDropdown('main')}
            >
              Categories <ChevronDown size={16} />
            </button>
            <div
              className="dropdown-menu"
              onMouseLeave={() => setActiveDropdown(null)}
              style={{ display: activeDropdown === 'main' ? 'flex' : 'none' }}
            >
              {categoryGroups.map((group) => (
                <div
                  key={group.name}
                  className="dropdown-group"
                  onMouseEnter={() => group.items && setActiveDropdown(group.name)}
                >
                  {group.items ? (
                    <>
                      <div className="dropdown-parent">
                        {group.name} <ChevronRight size={14} />
                      </div>
                      <div
                        className="dropdown-submenu"
                        style={{ display: activeDropdown === group.name ? 'flex' : 'none' }}
                      >
                        {group.items.map((item) => (
                          <Link
                            key={item}
                            to={`/category/${item.toLowerCase().replace(' ', '-')}`}
                            className="dropdown-item"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={`/category/${group.name.toLowerCase().replace(' ', '-')}`}
                      className="dropdown-parent"
                    >
                      {group.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/admin/login" className="nav-link admin-link">Admin Login</Link>
          <button className="nav-link cart-btn" onClick={onCartClick}>
            <ShoppingBag size={20} />
            <span className="cart-count">{totalItems}</span>
          </button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-menu"
          >
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <div className="mobile-dropdown">
              <span className="mobile-label">Categories</span>
              {categoryGroups.map((group) => (
                <div key={group.name} className="mobile-group">
                  {group.items ? (
                    <>
                      <span className="mobile-group-label">{group.name}</span>
                      {group.items.map((item) => (
                        <Link
                          key={item}
                          to={`/category/${item.toLowerCase().replace(' ', '-')}`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={`/category/${group.name.toLowerCase().replace(' ', '-')}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {group.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/admin/login" onClick={() => setIsOpen(false)}>Admin Login</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
