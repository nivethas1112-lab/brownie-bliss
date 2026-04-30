import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  compareAtPrice: {
    type: Number,
    min: 0,
  },
  cost: {
    type: Number,
    min: 0,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  images: [{
    type: String,
  }],
  variants: [{
    name: String,
    sku: String,
    price: Number,
    compareAtPrice: Number,
    inventory: Number,
    options: [{
      name: String,
      value: String,
    }],
  }],
  inventory: {
    type: Number,
    default: 0,
    min: 0,
  },
  trackInventory: {
    type: Boolean,
    default: true,
  },
  allowBackorder: {
    type: Boolean,
    default: false,
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'out_of_stock'],
    default: 'draft',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  metaTitle: String,
  metaDescription: String,
  tags: [String],
}, {
  timestamps: true,
});

productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
