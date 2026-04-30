import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
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
  excerpt: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    url: String,
    alt: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

blogSchema.index({ status: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
