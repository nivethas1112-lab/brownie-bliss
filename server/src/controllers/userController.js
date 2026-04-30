import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

// GET /users - Get all users (filter by role=admin,staff etc.)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) {
      // Support single role string or comma-separated list
      const roles = Array.isArray(role) ? role : role.split(',')
      filter.role = { $in: roles }
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// GET /users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// POST /users - Create new admin/staff user
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'admin', isActive = true } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      isActive,
    });

    const userWithoutPass = await User.findById(user._id)
      .select('-password -refreshToken')
      .lean();

    res.status(201).json({ user: userWithoutPass });
  } catch (error) {
    next(error);
  }
};

// PUT /users/:id - Update user
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive, password } = req.body;
    const updates = { name, email, role, isActive };
    if (password) {
      updates.password = password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// DELETE /users/:id - Delete user (soft by setting isActive false)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    next(error);
  }
};

// PATCH /users/:id/toggle-status
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: !(req.body.isActive ?? true) } },
      { new: true }
    )
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
