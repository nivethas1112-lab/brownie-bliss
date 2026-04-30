import Customer from '../models/Customer.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';

// GET /customers
export const getAllCustomers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      tags,
      isActive,
    } = req.query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const customers = await Customer.find(filter)
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Customer.countDocuments(filter);

    res.json({
      customers,
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

// GET /customers/:id
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('user', 'email')
      .populate('orders');
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    next(error);
  }
};

// PUT /customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'email');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    next(error);
  }
};

// DELETE /customers/:id
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};
