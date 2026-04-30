import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'cod'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['charge', 'refund', 'capture', 'void'],
    default: 'charge',
  },
  gateway: {
    name: String,
    transactionId: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
   failureReason: String,
   refundedAmount: {
     type: Number,
     default: 0,
   },
   refundedAt: Date,
   notes: {
     type: String,
     trim: true,
     default: '',
   },
 }, {
   timestamps: true,
 });

transactionSchema.index({ order: 1 });
transactionSchema.index({ 'gateway.transactionId': 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ status: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
