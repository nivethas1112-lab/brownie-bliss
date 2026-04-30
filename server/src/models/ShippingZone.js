import mongoose from 'mongoose';

const shippingZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  regions: {
    type: String,
    required: true,
    trim: true,
    description: 'Comma-separated list of regions, states, or countries'
  },
  baseRate: {
    type: Number,
    required: true,
    min: 0,
    description: 'Base shipping rate'
  },
  freeThreshold: {
    type: Number,
    min: 0,
    description: 'Minimum order amount for free shipping (null if not available)'
  },
  estimatedDays: {
    type: String,
    required: true,
    description: 'Estimated delivery time (e.g., "3-5 Days")'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

export default mongoose.models.ShippingZone || mongoose.model('ShippingZone', shippingZoneSchema);
