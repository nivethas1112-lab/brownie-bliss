import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: String,
  location: String,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

testimonialSchema.index({ isApproved: 1 });
testimonialSchema.index({ rating: 1 });
testimonialSchema.index({ featured: 1 });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
