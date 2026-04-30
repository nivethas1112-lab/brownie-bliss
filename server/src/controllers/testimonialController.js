import Testimonial from '../models/Testimonial.js';
import { auth } from '../middleware/auth.js';

// GET /testimonials
export const getAllTestimonials = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      isApproved,
      featured,
    } = req.query;

    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';

    const testimonials = await Testimonial.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Testimonial.countDocuments(filter);

    res.json({
      testimonials,
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

// GET /testimonials/:id
export const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ testimonial });
  } catch (error) {
    next(error);
  }
};

// POST /testimonials
export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ testimonial });
  } catch (error) {
    next(error);
  }
};

// PUT /testimonials/:id
export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ testimonial });
  } catch (error) {
    next(error);
  }
};

// DELETE /testimonials/:id
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// PATCH /testimonials/:id/approve
export const approveTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ testimonial });
  } catch (error) {
    next(error);
  }
};
