import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'
import AnnouncementBar from './components/AnnouncementBar'
import CartModal from './components/CartModal'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCreateProduct from './pages/admin/AdminCreateProduct'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCart from './pages/admin/AdminCart'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminLogin from './pages/admin/AdminLogin'
import AdminCategories from './pages/admin/AdminCategories'
import AdminShipping from './pages/admin/AdminShipping'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminCouponLogs from './pages/admin/AdminCouponLogs'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminProfile from './pages/admin/AdminProfile'
import AdminAdmins from './pages/admin/AdminAdmins'
import { useAuthStore } from './stores/useAuthStore.js'
import { useCartStore } from './stores/useCartStore.js'

/**
 * Admin Protected Route - Redirects unauthenticated users to login
 */
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppContent() {
  const isCartOpen = useCartStore((state) => state.isCartOpen); // Will add isCartOpen to store
  const setCartOpen = useCartStore((state) => state.setCartOpen); // Will add setCartOpen to store
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminPath && <Loader />}
      {!isAdminPath && <AnnouncementBar />}
      {!isAdminPath && <Navbar onCartClick={() => setCartOpen(true)} />}
      <main className={isAdminPath ? 'admin-main-container' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:type" element={<CategoryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
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
            <Route path="products/create" element={<AdminCreateProduct />} />
            <Route path="products/edit/:id" element={<AdminCreateProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="cart" element={<AdminCart />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="shipping" element={<AdminShipping />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="coupon-logs" element={<AdminCouponLogs />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="admins" element={<AdminAdmins />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <ScrollToTop />}
      {!isAdminPath && <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
