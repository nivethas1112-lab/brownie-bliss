import Transaction from '../models/Transaction.js';

// GET /transactions
export const getAllTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentMethod,
      type,
      startDate,
      endDate,
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .populate('order', 'orderNumber')
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
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

 // GET /transactions/:id
 export const getTransactionById = async (req, res, next) => {
   try {
     const transaction = await Transaction.findById(req.params.id)
       .populate('order', 'orderNumber')
       .populate('customer', 'firstName lastName email')
     
     if (!transaction) {
       return res.status(404).json({ message: 'Transaction not found' });
     }

     res.json({ transaction });
   } catch (error) {
     next(error);
   }
 };

// PATCH /transactions/:id
export const updateTransaction = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const updates = {};
    if (notes !== undefined) updates.notes = notes;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('order', 'orderNumber').populate('customer', 'firstName lastName email');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};
