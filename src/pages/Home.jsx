import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star, Clock, ThumbsUp } from 'lucide-react'
import Reveal from '../components/Reveal'
import ProductModal from '../components/ProductModal'
import './Home.css'

const Home = ({ onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [activeTestimonial, setActiveTestimonial] = React.useState(0)
  const [featuredIndex, setFeaturedIndex] = React.useState(0)

  const openModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const testimonials = [
    {
      text: "The fudgiest brownies I've ever had! The gift box was perfectly packed and made for an amazing birthday surprise.",
      user: "Sarah Collins",
      title: "Verified Lover of Chocolate",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
    },
    {
      text: "The Red Velvet cakes are out of this world. Soft, moist, and just the right amount of sweetness. Highly recommend!",
      user: "Mark Robinson",
      title: "Cake Enthusiast",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
    },
    {
      text: "Ordered a bunch of tubs for my party and everyone was obsessed. The Belgian chocolate quality is unmistakable.",
      user: "Emma Johnson",
      title: "Party Planner",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150"
    }
  ]

  const featured = [
    { id: 1, name: 'Triple Chocolate Fudgy', price: '₹199', img: '/assets1/1737386355174-998of1ip.webp', rating: 4.9, badge: 'Best Seller' },
    { id: 2, name: 'Red Velvet White Choco', price: '₹220', img: '/assets1/redvelvetcake123aws-1-of-1.jpg', rating: 4.8, badge: 'Sale - 10%' },
    { id: 3, name: 'Sea Salt Caramel Tub', price: '₹520', img: '/assets1/salted-caramel-ice-cream-260nw-2751842125.webp', rating: 5.0, badge: 'New In' },
    { id: 4, name: 'Walnut Crunch Brownie', price: '₹180', img: '/assets1/chocolate-walnut-brownie.avif', rating: 4.7 },
    { id: 5, name: 'Birthday Cake Slice', price: '₹240', img: '/assets1/images (1).jpg', rating: 4.9 },
    { id: 6, name: 'Assorted Treat Box', price: '₹999', img: '/assets1/ASSORTEDBOXOF9_10.webp', rating: 5.0, badge: 'Luxury' },
  ]

  React.useEffect(() => {
    const tInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 3000)

    const fInterval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % (featured.length - 2))
    }, 4000)

    return () => {
      clearInterval(tInterval)
      clearInterval(fInterval)
    }
  }, [testimonials.length, featured.length])

  const categories = [
    { name: 'Brownies', img: '/assets1/chocolate-brownie.webp' },
    { name: 'Cakes', img: '/assets1/item-642f5ad0783b8.jpg' },
    { name: 'Tubs', img: '/assets1/TiramisuDessertTub.webp' },
    { name: 'Jar Cakes', img: '/assets1/p-red-velvet-jar-cake-150gm-272450-m.avif' },
    { name: 'Cookies', img: '/assets1/Cookie-Monster-Cookies.jpg' },
    { name: 'Cupcakes', img: '/assets1/SOP_Cupcake_web-LG-e1770142023962-2-1200x901.jpg' },
    { name: 'Dream Cakes', img: '/assets1/chocolate-tub-cake.jpg' },
    { name: 'Vegans', img: '/assets1/64b95a4329858e4bbafc5e84_IMG_3043.jpg' },
    { name: 'Roll Cakes', img: '/assets1/fresh-mango-cake-roll-with-whipped-cream-1-735x735.jpg' },
    { name: 'Gift Boxes', img: '/assets1/Brownie-Box-delivered-2.jpg' }
  ]


  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <span className="hero-sub">Freshly Baked Every Day</span>
            <h1 className="hero-title">Indulge in <br /><span>Sweet Bliss</span></h1>
            <p className="hero-desc">Discover the richest, fudgiest brownies and desserts handcrafted with love and the finest chocolate.</p>
            <button className="btn-primary">Explore Menu <ArrowRight size={20} /></button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-image-container"
          >
            <div className="hero-image-bg"></div>
            <img src="/assets/3-brownie-stack-falling-playful-600nw-2723000925.webp" alt="Delicious Brownies" className="hero-img" />
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="section-title">Featured Delights</h2>
              <p className="section-subtitle">Our most loved treats this week</p>
            </div>
          </Reveal>

          <div className="product-grid">
            {featured.map((item) => (
              <div key={item.id} className="product-card" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
                <div className="card" style={{ height: '100%', padding: '1.5rem' }}>
                  <div className="product-img-wrapper">
                    <img src={item.img} alt={item.name} className="product-img" />
                    {item.badge && <div className={`product-badge ${item.badge.toLowerCase().includes('sale') ? 'sale' : item.badge.toLowerCase().includes('new') ? 'new' : ''}`}>{item.badge}</div>}
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-rating"><Star size={16} fill="var(--brown-primary)" /> {item.rating}</span>
                      <span className="product-price">{item.price}</span>
                    </div>
                    <h3 className="product-name">{item.name}</h3>
                    <button className="btn-add">Quick View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section categories-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Find your perfect sweet match</p>
            </div>
          </Reveal>
          <div className="category-grid">
            {categories.map((cat, index) => (
              <Reveal key={cat.name} delay={index * 0.1}>
                <Link to={`/category/${cat.name.toLowerCase().replace(' ', '-')}`} className="category-card">
                  <div className="category-img-container">
                    <img src={cat.img} alt={cat.name} className="category-img" />
                  </div>
                  <span className="category-name">{cat.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="section-title">Sweet Words</h2>
              <p className="section-subtitle">What our happy customers say</p>
            </div>
          </Reveal>

          <div className="testimonial-carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card card active"
              >
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#ffd700" color="#ffd700" />)}
                </div>
                <p>"{testimonials[activeTestimonial].text}"</p>
                <div className="testimonial-user">
                  <img src={testimonials[activeTestimonial].img} alt={testimonials[activeTestimonial].user} className="user-avatar-img" />
                  <div>
                    <h4>{testimonials[activeTestimonial].user}</h4>
                    <span>{testimonials[activeTestimonial].title}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="carousel-dots">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`dot ${activeTestimonial === i ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(i)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-us">
        <div className="container grid-3">
          <div className="feature-card">
            <div className="feature-icon"><Star size={32} /></div>
            <h3>Premium Quality</h3>
            <p>We use only the finest Belgian chocolate and organic ingredients.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Clock size={32} /></div>
            <h3>Always Fresh</h3>
            <p>Our brownies are baked fresh daily to ensure maximum fudginess.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ThumbsUp size={32} /></div>
            <h3>Loved by All</h3>
            <p>Over 10,000+ happy customers across the country.</p>
          </div>
        </div>
      </section>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />
    </div>
  )
}

export default Home
