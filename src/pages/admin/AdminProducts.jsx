import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, X, Upload } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminProducts.css'

const MOCK_PRODUCTS = [
  { id: '1', name: 'Triple Chocolate Fudgy', category: 'Brownies', categoryId: '', price: 199, status: 'active', image: '/assets1/1737386355174-998of1ip.webp', description: 'Ultra-fudgy triple chocolate brownie' },
  { id: '2', name: 'Red Velvet White Choco', category: 'Dream Cake', categoryId: '', price: 220, status: 'active', image: '/assets1/redvelvetcake123aws-1-of-1.jpg', description: 'Classic red velvet with white chocolate' },
  { id: '3', name: 'Sea Salt Caramel Tub', category: 'Tubs', categoryId: '', price: 520, status: 'active', image: '/assets1/salted-caramel-ice-cream-260nw-2751842125.webp', description: 'Caramel sea salt dessert tub' },
  { id: '4', name: 'Walnut Crunch Brownie', category: 'Brownies', categoryId: '', price: 180, status: 'out_of_stock', image: '/assets1/chocolate-walnut-brownie.avif', description: 'Chunky walnut chocolate brownie' },
  { id: '5', name: 'Vegan Chocolate Delight', category: 'Vegans', categoryId: '', price: 140, status: 'active', image: '/assets1/64b95a4329858e4bbafc5e84_IMG_3043.jpg', description: 'Vegan chocolate treat' },
  { id: '6', name: 'Fresh Mango Roll Cake', category: 'Roll Cakes', categoryId: '', price: 280, status: 'active', image: '/assets1/fresh-mango-cake-roll-with-whipped-cream-1-735x735.jpg', description: 'Fresh mango roll cake' },
  { id: '7', name: 'Classic Cupcake Box', category: 'Cupcakes', categoryId: '', price: 199, status: 'active', image: '/assets1/SOP_Cupcake_web-LG-e1770142023962-2-1200x901.jpg', description: 'Classic cupcake box' },
  { id: '8', name: 'Premium Gift Box', category: 'Gift Boxes', categoryId: '', price: 999, status: 'active', image: '/assets1/Brownie-Box-delivered-2.jpg', description: 'Premium gift box' },
  { id: '9', name: 'Chocolate Jar Cake', category: 'Jar Cakes', categoryId: '', price: 250, status: 'active', image: '/assets1/p-red-velvet-jar-cake-150gm-272450-m.avif', description: 'Chocolate jar cake' },
  { id: '10', name: 'Cookie Monster Tub', category: 'Cookies', categoryId: '', price: 320, status: 'active', image: '/assets1/Cookie-Monster-Cookies.jpg', description: 'Cookie monster tub' },
]

const AdminProducts = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [dbCategories, setDbCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    category: '', // This will store the Category ObjectId
    price: '',
    status: 'active',
    description: '',
    image: ''
  })

  const categories = ['Brownies', 'Dream Cake', 'Jar Cakes', 'Cookies', 'Vegans', 'Roll Cakes', 'Cupcakes', 'Gift Boxes', 'Tubs']
  const categoryOptions = dbCategories.length > 0
    ? dbCategories.map(cat => ({ value: cat._id || cat.id, label: cat.name }))
    : categories.map(cat => ({ value: cat, label: cat }))

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [prodRes, catRes] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll()
        ])
        
        // Handle Categories
        const categoryList = Array.isArray(catRes) ? catRes : catRes.categories || []
        setDbCategories(categoryList)

        // Handle Products
        const productList = Array.isArray(prodRes) ? prodRes : prodRes.products || []
        const formatted = productList.map(p => ({
          id: p._id || p.id,
          name: p.name,
          category: p.category?.name || p.category || 'Brownies',
          categoryId: p.category?._id || p.category || '',
          price: p.price,
          status: p.status || 'active',
          image: p.image || p.images?.[0] || '/assets1/product-placeholder.jpg',
          description: p.description || ''
        }))
        setProducts(formatted.length > 0 ? formatted : MOCK_PRODUCTS)
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch data, using mock data:', err.message)
        setError('Using cached data')
        setProducts(MOCK_PRODUCTS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleOpenModal = (product = null) => {
    if (product) {
      const matchedCategory =
        categoryOptions.find(opt => opt.value === product.categoryId) ||
        categoryOptions.find(opt => opt.label === product.category) ||
        categoryOptions[0]

      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: matchedCategory?.value || '',
        price: product.price.toString(),
        status: product.status,
        description: product.description || '',
        image: product.image
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        category: categoryOptions[0]?.value || '',
        price: '',
        status: 'active',
        description: '',
        image: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        status: formData.status,
        description: formData.description,
        image: formData.image
      }
      const selectedCategoryName = categoryOptions.find(opt => opt.value === formData.category)?.label || formData.category

      if (editingProduct) {
        const isValidId = /^[0-9a-fA-F]{24}$/.test(editingProduct.id)
        if (!isValidId) {
          // Local update for mock/non-ObjectId products
          const transformed = {
            ...editingProduct,
            ...productData,
            category: selectedCategoryName,
            categoryId: formData.category,
            id: editingProduct.id
          }
          setProducts(products.map(p =>
            p.id === editingProduct.id ? transformed : p
          ))
          handleCloseModal()
          return
        }
        // Update via API
        const response = await api.products.update(editingProduct.id, productData)
        const updated = response.product || response
        setProducts(products.map(p =>
          p.id === editingProduct.id
            ? { 
                ...p, 
                ...updated, 
                id: updated._id || updated.id,
                category: updated.category?.name || updated.category || selectedCategoryName || p.category,
                categoryId: updated.category?._id || updated.category || formData.category || p.categoryId
              }
            : p
        ))
      } else {
        // Create via API
        const response = await api.products.create(productData)
        const created = response.product || response
        setProducts([...products, { 
          ...created, 
          id: created._id || created.id,
          category: created.category?.name || created.category || selectedCategoryName || 'Brownies',
          categoryId: created.category?._id || created.category || formData.category || ''
        }])
      }
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save product:', err)
      alert('Failed to save product: ' + (err.response?.data?.message || err.message))
    }
   }

  const toggleStatus = async (id, newStatus) => {
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id)
    
    // Optimistic UI update
    const previousProducts = [...products]
    setProducts(products.map(p =>
      p.id === id ? { ...p, status: newStatus } : p
    ))

    try {
      if (isValidId) {
        try {
          await api.products.update(id, { status: newStatus })
          window.dispatchEvent(new CustomEvent('admin-notification', { 
            detail: { message: `Product status updated to ${newStatus}!`, type: 'success' } 
          }))
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Product not found in DB, kept local change for demo.')
            window.dispatchEvent(new CustomEvent('admin-notification', { 
              detail: { message: `Mock Product status updated to ${newStatus}!`, type: 'success' } 
            }))
          } else {
            throw apiErr
          }
        }
      } else {
        window.dispatchEvent(new CustomEvent('admin-notification', { 
          detail: { message: `Mock Product status updated to ${newStatus}!`, type: 'success' } 
        }))
      }
    } catch (err) {
      console.error('Failed to toggle product status:', err)
      setProducts(previousProducts) // Rollback on real error
      window.dispatchEvent(new CustomEvent('admin-notification', { 
        detail: { message: 'Failed to update product on server', type: 'error' } 
      }))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await api.products.delete(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product.')
    }
  }
return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button className="admin-btn-primary" onClick={() => navigate('/admin/products/create')}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="admin-filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {(dbCategories.length > 0 ? dbCategories.map(c => c.name) : categories).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-cell">
                    <div className="admin-product-image">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling && (e.target.nextSibling.style.display = 'flex')
                        }}
                      />
                    </div>
                    <span className="admin-product-name">{product.name}</span>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>
                  <select
                    className={`status-select ${product.status}`}
                    value={product.status}
                    onChange={(e) => toggleStatus(product.id, e.target.value)}
                    style={{ border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '15px' }}
                  >
                    <option value="active">Active</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                 <td>
                   <div className="admin-actions">
                     <button className="admin-action-btn edit" onClick={() => handleOpenModal(product)}>
                       <Edit2 size={16} />
                     </button>
                     <button className="admin-action-btn delete" onClick={() => handleDelete(product.id)}>
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categoryOptions.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Product Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/assets1/your-image.jpg"
                  />
                  <div className="admin-image-preview-mini" style={{ marginTop: '0.5rem' }}>
                    <img src={formData.image || '/assets1/product-placeholder.jpg'} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
