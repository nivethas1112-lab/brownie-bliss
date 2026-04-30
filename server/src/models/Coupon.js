import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  maxDiscount: {
    type: Number,
    min: 0,
  },
  minimumAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  maximumUses: {
    type: Number,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    usedAt: Date,
  }],
  appliesTo: {
    type: {
      type: String,
      enum: ['all', 'categories', 'products', 'exclude'],
      default: 'all',
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  },
  isValidFor: {
    type: {
      type: String,
      enum: ['once', 'recurring', 'forever'],
      default: 'once',
    },
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

couponSchema.index({ isActive: 1 });
couponSchema.index({ startDate: 1, expiryDate: 1 });

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
