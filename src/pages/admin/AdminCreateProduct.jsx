import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import './AdminCreateProduct.css';

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    hsnCode: '',
    category: '',
    collection: '',
    status: 'Active',
    price: '',
    mrp: '',
    stockQuantity: '',
    lowStockAlert: '',
    inventoryStatus: 'In Stock',
    taxClass: 'Standard',
    badgeLabel: '',
    rating: '',
    reviewsCount: '',
    featuredProduct: false,
    newArrival: false,
    allowBackorders: false,
    shortSummary: '',
    fullDescription: '',
    primaryImagePath: '',
    galleryImagesPath: '',
    weight: '',
    dimensions: '',
    dietType: '',
    shelfLife: '',
    tags: '',
    metaTitle: '',
    urlSlug: '',
    metaDescription: ''
  });

  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.categories.getAll();
        const categoryList = Array.isArray(response) ? response : response.categories || [];
        setDbCategories(categoryList.map(c => ({ id: c._id || c.id, name: c.name })));
      } catch (err) {
        console.warn('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const response = await api.products.getById(id);
          const product = response.product || response;
          setFormData({
            ...formData,
            name: product.name || '',
            sku: product.sku || '',
            category: product.category?._id || product.category || '',
            price: product.price || '',
            mrp: product.compareAtPrice || '',
            status: product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Active',
            stockQuantity: product.inventory || '',
            featuredProduct: product.featured || false,
            shortSummary: product.description ? product.description.substring(0, 100) : '',
            fullDescription: product.description || '',
            primaryImagePath: product.image || product.images?.[0] || '',
            tags: product.tags ? product.tags.join(', ') : '',
            urlSlug: product.slug || ''
          });
        } catch (err) {
          console.error('Failed to fetch product for editing:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        compareAtPrice: parseFloat(formData.mrp) || 0,
        description: formData.fullDescription || formData.shortSummary,
        category: formData.category,
        image: formData.primaryImagePath,
        status: formData.status.toLowerCase(),
        inventory: parseInt(formData.stockQuantity) || 0,
        featured: formData.featuredProduct,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t),
        slug: formData.urlSlug
      };
      
      if (isEditMode) {
        await api.products.update(id, payload);
        alert('Product updated successfully!');
      } else {
        await api.products.create(payload);
        alert('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Check console for details.');
    }
  };

  return (
    <div className="admin-create-product">
      <div className="acp-header">
        <div className="acp-header-left">
          <h1 className="acp-title">{isEditMode ? 'Edit Product' : 'Create Product'}</h1>
          <p className="acp-subtitle">
            {isEditMode ? 'Update product details and synchronize with the catalog.' : 'Create and publish a new product for your store catalog.'}
          </p>
        </div>
        <button className="acp-back-btn" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={16} /> BACK TO PRODUCTS
        </button>
      </div>

      <form className="acp-form-layout" onSubmit={handleSubmit}>
        {/* Left Column */}
        <div className="acp-column">
          
          {/* Core Details */}
          <div className="acp-card">
            <div className="acp-card-header">
              <h2 className="acp-card-title">Core Details</h2>
              <span className="acp-card-badge">IDENTITY</span>
            </div>
            
            <div className="acp-form-group full-width">
              <label>PRODUCT NAME <span>*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Triple Chocolate Fudgy" required />
            </div>

            <div className="acp-row">
              <div className="acp-form-group">
                <label>SKU <span>*</span></label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. BB-BR-01" required />
              </div>
              <div className="acp-form-group">
                <label>HSN CODE</label>
                <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="123456" />
              </div>
            </div>

            <div className="acp-row">
              <div className="acp-form-group">
                <label>CATEGORY <span>*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {dbCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="acp-form-group">
                <label>COLLECTION</label>
                <select name="collection" value={formData.collection} onChange={handleChange}>
                  <option value="">Select Collection</option>
                  <option value="Best Sellers">Best Sellers</option>
                  <option value="New Arrivals">New Arrivals</option>
                  <option value="Festive Specials">Festive Specials</option>
                  <option value="Signature Series">Signature Series</option>
                </select>
              </div>
            </div>

            <div className="acp-form-group half-width">
              <label>STATUS</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
                <option value="Out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="acp-card">
            <div className="acp-card-header">
              <h2 className="acp-card-title">Description</h2>
              <span className="acp-card-badge">STORY</span>
            </div>
            
            <div className="acp-form-group full-width">
              <label>SHORT SUMMARY</label>
              <input type="text" name="shortSummary" value={formData.shortSummary} onChange={handleChange} placeholder="A short description of the product." />
            </div>

            <div className="acp-form-group full-width">
              <label>FULL DESCRIPTION</label>
              <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} placeholder="Share the ingredients, taste profile, and preparation details." rows="4"></textarea>
              <p className="acp-help-text">Highlight allergy information, storage instructions, and serving suggestions.</p>
            </div>
          </div>

          {/* Media */}
          <div className="acp-card">
            <div className="acp-card-header">
              <h2 className="acp-card-title">Media</h2>
              <span className="acp-card-badge">GALLERY</span>
            </div>
            
            <div className="acp-form-group full-width">
              <label>PRIMARY IMAGE PATH</label>
              <input type="text" name="primaryImagePath" value={formData.primaryImagePath} onChange={handleChange} placeholder="assets1/your-image.png" />
            </div>

            <div className="acp-form-group full-width">
              <label>UPLOAD PRIMARY IMAGE <span>*</span></label>
              <div className="acp-file-upload-row">
                <button type="button" className="acp-upload-btn">CHOOSE FILE</button>
                <span className="acp-file-name">No file chosen</span>
              </div>
            </div>

            <div className="acp-form-group full-width">
              <label>GALLERY IMAGES (COMMA SEPARATED)</label>
              <textarea name="galleryImagesPath" value={formData.galleryImagesPath} onChange={handleChange} placeholder="assets1/img1.png, assets1/img2.png" rows="2"></textarea>
            </div>

            <div className="acp-form-group full-width">
              <div className="acp-file-upload-row">
                <button type="button" className="acp-upload-btn">CHOOSE FILES</button>
                <span className="acp-file-name">No files chosen</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="acp-column">

          {/* Pricing and Inventory */}
          <div className="acp-card">
            <div className="acp-card-header">
              <h2 className="acp-card-title">Pricing and Inventory</h2>
              <span className="acp-card-badge">COMMERCE</span>
            </div>
            
            <div className="acp-row">
              <div className="acp-form-group">
                <label>PRICE (RS.) <span>*</span></label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div className="acp-form-group">
                <label>MRP (RS.)</label>
                <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>

            <div className="acp-row">
              <div className="acp-form-group">
                <label>STOCK QUANTITY <span>*</span></label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="0" required />
              </div>
              <div className="acp-form-group">
                <label>LOW STOCK ALERT</label>
                <input type="number" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleChange} placeholder="0" />
              </div>
            </div>

            <div className="acp-row">
              <div className="acp-form-group">
                <label>INVENTORY STATUS <span>*</span></label>
                <select name="inventoryStatus" value={formData.inventoryStatus} onChange={handleChange} required>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="On Backorder">On Backorder</option>
                </select>
              </div>
              <div className="acp-form-group">
                <label>TAX CLASS</label>
                <select name="taxClass" value={formData.taxClass} onChange={handleChange}>
                  <option value="Standard">Standard</option>
                  <option value="Tax Free">Tax Free</option>
                </select>
              </div>
            </div>

            <div className="acp-row">
              <div className="acp-form-group">
                <label>BADGE LABEL</label>
                <input type="text" name="badgeLabel" value={formData.badgeLabel} onChange={handleChange} placeholder="New / Trending / Premium" />
              </div>
              <div className="acp-form-group">
                <label>RATING (0-5)</label>
                <input type="number" step="0.1" max="5" min="0" name="rating" value={formData.rating} onChange={handleChange} placeholder="5.0" />
              </div>
            </div>

            <div className="acp-form-group full-width">
              <label>REVIEWS COUNT</label>
              <input type="number" name="reviewsCount" value={formData.reviewsCount} onChange={handleChange} placeholder="0" />
            </div>

            <div className="acp-toggle-group">
              <div className="acp-toggle-item">
                <span className="acp-toggle-label">FEATURED PRODUCT</span>
                <label className="acp-switch">
                  <input type="checkbox" name="featuredProduct" checked={formData.featuredProduct} onChange={handleChange} />
                  <span className="acp-slider round"></span>
                </label>
              </div>
              <div className="acp-toggle-item">
                <span className="acp-toggle-label">NEW ARRIVAL</span>
                <label className="acp-switch">
                  <input type="checkbox" name="newArrival" checked={formData.newArrival} onChange={handleChange} />
                  <span className="acp-slider round"></span>
                </label>
              </div>
              <div className="acp-toggle-item">
                <span className="acp-toggle-label">ALLOW BACKORDERS</span>
                <label className="acp-switch">
                  <input type="checkbox" name="allowBackorders" checked={formData.allowBackorders} onChange={handleChange} />
                  <span className="acp-slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Shipping and Attributes */}
          <div className="acp-card">
            <div className="acp-card-header">
              <h2 className="acp-card-title">Shipping and Attributes</h2>
              <span className="acp-card-badge">LOGISTICS</span>
            </div>
            
            <div className="acp-row">
              <div className="acp-form-group">
                <label>WEIGHT (KG)</label>
                <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 0.5" />
              </div>
              <div className="acp-form-group">
                <label>DIMENSIONS (L X W X H CM)</label>
                <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="e.g. 10 x 10 x 5" />
              </div>
            </div>

            <div className="acp-row">
              <div className="acp-form-group">
                <label>DIET TYPE</label>
                <select name="dietType" value={formData.dietType} onChange={handleChange}>
                  <option value="">Select Diet</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>
              <div className="acp-form-group">
                <label>SHELF LIFE (DAYS)</label>
                <input type="text" name="shelfLife" value={formData.shelfLife} onChange={handleChange} placeholder="e.g. 3 Days" />
              </div>
            </div>

            <div className="acp-form-group full-width">
              <label>TAGS</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="chocolate, fudgy, bestseller" />
            </div>
          </div>

          {/* SEO and Visibility */}
          <div className="acp-card">
            <div className="acp-card-header">
              <h2 className="acp-card-title">SEO and Visibility</h2>
              <span className="acp-card-badge">SEARCH</span>
            </div>
            
            <div className="acp-row">
              <div className="acp-form-group">
                <label>META TITLE</label>
                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Product Name - Brownie Bliss" />
              </div>
              <div className="acp-form-group">
                <label>URL SLUG</label>
                <input type="text" name="urlSlug" value={formData.urlSlug} onChange={handleChange} placeholder="product-name" />
              </div>
            </div>

            <div className="acp-form-group full-width">
              <label>META DESCRIPTION</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} placeholder="Short summary for search engines." rows="2"></textarea>
            </div>
          </div>
          
          <div className="acp-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="submit" className="acp-submit-btn">Create Product</button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AdminCreateProduct;
