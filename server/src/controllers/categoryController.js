import Category from '../models/Category.js';
import { auth } from '../middleware/auth.js';

// GET /categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('parentId', 'name slug')
      .sort({ name: 1 })
      .lean();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// GET /categories/:id
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

// POST /categories
export const createCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    const category = await Category.create(data);
    const populated = await Category.findById(category._id)
      .populate('parentId', 'name slug');
    
    res.status(201).json({ category: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    ).populate('parentId', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

// DELETE /categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
