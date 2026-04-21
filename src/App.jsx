import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'
import AnnouncementBar from './components/AnnouncementBar'
import CartModal from './components/CartModal'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminLogin from './pages/admin/AdminLogin'

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false)

  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  return (
    <Router>
      <div className="app">
        <Loader />
        <AnnouncementBar />
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <main>
          <Routes>
            <Route path="/" element={<Home onAddToCart={() => setIsCartOpen(true)} />} />
            <Route path="/category/:type" element={<CategoryPage onAddToCart={() => setIsCartOpen(true)} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </Router>
  )
}

export default App
