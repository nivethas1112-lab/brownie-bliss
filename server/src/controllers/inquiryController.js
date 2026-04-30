import Inquiry from '../models/Inquiry.js';
import { auth } from '../middleware/auth.js';

// GET /inquiries
export const getAllInquiries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      assignedTo,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const inquiries = await Inquiry.find(filter)
      .populate('assignedTo', 'name email')
      .populate('repliedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Inquiry.countDocuments(filter);

    res.json({
      inquiries,
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

// GET /inquiries/:id
export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('repliedBy', 'name');
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    next(error);
  }
};

// POST /inquiries
export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ inquiry });
  } catch (error) {
    next(error);
  }
};

// PATCH /inquiries/:id/status
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, reply } = req.body;
    const updates = { status };
    
    if (reply) {
      updates.reply = reply;
      updates.repliedBy = req.user._id;
      updates.repliedAt = new Date();
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('assignedTo', 'name email').populate('repliedBy', 'name');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    next(error);
  }
};

// DELETE /inquiries/:id
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
