import Blog from '../models/Blog.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { auth } from '../middleware/auth.js';

// GET /blogs
export const getAllBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const blogs = await Blog.find(filter)
      .populate('author', 'name')
      .populate('category', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /blogs/:id
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name')
      .populate('category', 'name');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    next(error);
  }
};

// POST /blogs
export const createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    
    // Set publishedAt if status is published
    if (req.body.status === 'published' && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }

    const blog = await Blog.create(req.body);
    const populated = await Blog.findById(blog._id)
      .populate('author', 'name')
      .populate('category', 'name');

    res.status(201).json({ blog: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /blogs/:id
export const updateBlog = async (req, res, next) => {
  try {
    // Update publishedAt if status changed to published
    if (req.body.status === 'published') {
      req.body.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name').populate('category', 'name');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    next(error);
  }
};

// DELETE /blogs/:id
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};
