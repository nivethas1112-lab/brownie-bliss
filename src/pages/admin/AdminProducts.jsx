import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Upload } from 'lucide-react'
import './AdminProducts.css'

const AdminProducts = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Triple Chocolate Fudgy', category: 'Brownies', price: 199, stock: 25, status: 'active', image: '/assets1/1737386355174-998of1ip.webp' },
    { id: 2, name: 'Red Velvet White Choco', category: 'Dream Cake', price: 220, stock: 10, status: 'active', image: '/assets1/redvelvetcake123aws-1-of-1.jpg' },
    { id: 3, name: 'Sea Salt Caramel Tub', category: 'Tubs', price: 520, stock: 15, status: 'active', image: '/assets1/salted-caramel-ice-cream-260nw-2751842125.webp' },
    { id: 4, name: 'Walnut Crunch Brownie', category: 'Brownies', price: 180, stock: 0, status: 'out_of_stock', image: '/assets1/chocolate-walnut-brownie.avif' },
    { id: 5, name: 'Vegan Chocolate Delight', category: 'Vegans', price: 140, stock: 8, status: 'active', image: '/assets1/64b95a4329858e4bbafc5e84_IMG_3043.jpg' },
    { id: 6, name: 'Fresh Mango Roll Cake', category: 'Roll Cakes', price: 280, stock: 5, status: 'active', image: '/assets1/fresh-mango-cake-roll-with-whipped-cream-1-735x735.jpg' },
    { id: 7, name: 'Classic Cupcake Box', category: 'Cupcakes', price: 199, stock: 20, status: 'active', image: '/assets1/SOP_Cupcake_web-LG-e1770142023962-2-1200x901.jpg' },
    { id: 8, name: 'Premium Gift Box', category: 'Gift Boxes', price: 999, stock: 12, status: 'active', image: '/assets1/Brownie-Box-delivered-2.jpg' },
    { id: 9, name: 'Chocolate Jar Cake', category: 'Jar Cakes', price: 250, stock: 18, status: 'active', image: '/assets1/p-red-velvet-jar-cake-150gm-272450-m.avif' },
    { id: 10, name: 'Cookie Monster Tub', category: 'Cookies', price: 320, stock: 14, status: 'active', image: '/assets1/Cookie-Monster-Cookies.jpg' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    category: 'Brownies',
    price: '',
    stock: '',
    description: '',
    image: ''
  })

  const categories = ['Brownies', 'Dream Cake', 'Jar Cakes', 'Cookies', 'Vegans', 'Roll Cakes', 'Cupcakes', 'Gift Boxes', 'Tubs']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: '',
        image: product.image
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        category: 'Brownies',
        price: '',
        stock: '',
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : p
      ))
    } else {
      setProducts([...products, {
        id: products.length + 1,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: 'active',
        image: '/assets/product-placeholder.jpg'
      }])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Product
        </button>
      </div>

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
          {categories.map(cat => (
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
              <th>Stock</th>
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
                      <div className="admin-product-placeholder">🍫</div>
                    </div>
                    <span className="admin-product-name">{product.name}</span>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : ''}>
                    {product.stock === 0 ? 'Out of Stock' : product.stock}
                  </span>
                </td>
                <td>
                  <span className={`status ${product.status}`}>
                    {product.status === 'out_of_stock' ? 'Out of Stock' : 'Active'}
                  </span>
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
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Price ($)</label>
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
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    placeholder="0"
                  />
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
                  <label>Product Image</label>
                  <div className="admin-image-upload">
                    <Upload size={24} />
                    <span>Drag & drop or click to upload</span>
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
