import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { auth } from '../middleware/auth.js';

// GET /cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name slug price images');

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      });
    }

    res.json({ cart });
  } catch (error) {
    next(error);
  }
};

// POST /cart/items
export const addCartItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Valid Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await recalculateCartTotals(cart);
    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate('items.product', 'name slug price images');

    res.json({ cart: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /cart/items/:itemId
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await recalculateCartTotals(cart);
    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate('items.product', 'name slug price images');

    res.json({ cart: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /cart/items/:itemId
export const removeCartItem = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.itemId
    );

    await recalculateCartTotals(cart);
    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate('items.product', 'name slug price images');

    res.json({ cart: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        items: [],
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        coupon: null,
      },
      { new: true }
    );

    res.json({ cart });
  } catch (error) {
    next(error);
  }
};

// POST /cart/apply-coupon
export const applyCoupon = async (req, res, next) => {
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

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cart.subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    } else if (coupon.type === 'free_shipping') {
      discount = cart.shipping;
    }

    cart.coupon = {
      code: coupon.code,
      discount,
      type: coupon.type,
    };
    cart.total = cart.subtotal + cart.tax + cart.shipping - discount;

    await cart.save();

    res.json({ cart });
  } catch (error) {
    next(error);
  }
};

// Helper function
async function recalculateCartTotals(cart) {
  const productIds = cart.items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  
  let subtotal = 0;
  cart.items.forEach(item => {
    const product = products.find(p => p._id.equals(item.product));
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  
  cart.itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.subtotal = subtotal;
  cart.tax = tax;
  
  // Apply coupon discount if exists
  let total = subtotal + tax + cart.shipping;
  if (cart.coupon) {
    if (cart.coupon.type === 'percentage') {
      const discount = (subtotal * cart.coupon.discount) / 100;
      total -= discount;
    } else if (cart.coupon.type === 'fixed') {
      total -= cart.coupon.discount;
    } else if (cart.coupon.type === 'free_shipping') {
      total -= cart.shipping;
    }
  }
  
  cart.total = Math.max(0, total);
}
