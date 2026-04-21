import React from 'react'
import { Link } from 'react-router-dom'
import { Share2, MessagesSquare, Globe, Heart } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo" style={{ color: 'var(--brown-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src="/assets/3-brownie-stack-falling-playful-600nw-2723000925-removebg-preview.png" alt="Brownie Bliss Logo" style={{ height: '40px' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Playfair Display, serif' }}>Brownie Bliss</span>
          </Link>
          <p className="footer-tagline">Making the world a sweeter place, one brownie at a time.</p>
          <div className="social-links">
            <a href="#"><Share2 size={20} /></a>
            <a href="#"><MessagesSquare size={20} /></a>
            <a href="#"><Globe size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/gift-boxes">Gift Boxes</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/category/brownies">Brownies</Link></li>
            <li><Link to="/category/cakes">Cakes</Link></li>
            <li><Link to="/category/tubs">Tubs</Link></li>
            <li><Link to="/category/gift-boxes">Gift Boxes</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <p>Subscribe to get special offers and seasonal treats!</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Brownie Bliss. Made with <Heart size={14} fill="var(--brown-primary)" /> for dessert lovers.</p>
      </div>
    </footer>
  )
}

export default Footer
