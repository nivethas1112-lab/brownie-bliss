import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  variant: {
    name: String,
    sku: String,
    options: [mongoose.Schema.Types.Mixed],
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  discount: {
    amount: { type: Number, default: 0 },
    coupon: String,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Shipping address
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['stripe', 'cod', 'paypal', 'other'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'completed'],
    default: 'pending',
  },
  notes: String,
  
  // Tracking
  trackingNumber: String,
  trackingUrl: String,
  shippedAt: Date,
  deliveredAt: Date,
  
}, {
  timestamps: true,
});

orderSchema.index({ 'customer': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

// Generate order number before save
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${dateStr}-${random}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
