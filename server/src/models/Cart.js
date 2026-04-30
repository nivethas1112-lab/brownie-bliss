import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  itemCount: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  coupon: {
    code: String,
    discount: Number,
    type: String, // 'percentage' or 'fixed'
  },
}, {
  timestamps: true,
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
