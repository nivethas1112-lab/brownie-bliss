import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  addresses: [{
    type: {
      type: String,
      enum: ['billing', 'shipping'],
    },
    fullName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String,
    isDefault: { type: Boolean, default: false },
  }],
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  notes: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

customerSchema.index({ email: 1 });
customerSchema.index({ firstName: 1, lastName: 1 });
customerSchema.index({ 'user': 1 });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
