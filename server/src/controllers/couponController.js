import Coupon from '../models/Coupon.js';
import { auth } from '../middleware/auth.js';

// GET /coupons
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({ coupons });
  } catch (error) {
    next(error);
  }
};

// GET /coupons/:id
export const getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ coupon });
  } catch (error) {
    next(error);
  }
};

// POST /coupons
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  } catch (error) {
    next(error);
  }
};

// PUT /coupons/:id
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ coupon });
  } catch (error) {
    next(error);
  }
};

// DELETE /coupons/:id
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// POST /coupons/validate
export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      expiryDate: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (coupon.maximumUses && coupon.usedCount >= coupon.maximumUses) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    res.json({ 
      coupon: {
        id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
        minimumAmount: coupon.minimumAmount,
        maxDiscount: coupon.maxDiscount,
      }
    });
  } catch (error) {
    next(error);
  }
};
