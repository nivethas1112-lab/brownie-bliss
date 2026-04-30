import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';

// GET /dashboard/stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const { range = '7d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();

    switch (range) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case '1y':
        dateFilter = { createdAt: { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    }

    // Calculate stats in parallel
    const [totalOrders, totalCustomers, totalProducts, totalRevenue, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Customer.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find()
        .populate('customer', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Get orders status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const ordersByStatus = statusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue: revenue,
        pendingOrders: ordersByStatus.pending || 0,
        processingOrders: ordersByStatus.processing || 0,
        shippedOrders: ordersByStatus.shipped || 0,
        deliveredOrders: ordersByStatus.delivered || 0,
        cancelledOrders: ordersByStatus.cancelled || 0,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /dashboard/recent-orders
export const getRecentOrders = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const orders = await Order.find()
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

// GET /dashboard/sales
export const getSalesData = async (req, res, next) => {
  try {
    const { range = '7d' } = req.query;
    let days = 7;

    switch (range) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      default: days = 7;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get paid orders grouped by date
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          date: { $first: '$createdAt' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    // Format response
    const formatted = salesData.map(item => ({
      date: new Date(item._id.year, item._id.month - 1, item._id.day).toISOString().split('T')[0],
      revenue: item.revenue,
      orders: item.orders,
    }));

    res.json({ salesData });
  } catch (error) {
    next(error);
  }
};

// Simple health check
export const healthCheck = async (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
