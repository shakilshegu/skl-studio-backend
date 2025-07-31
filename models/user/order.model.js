// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Razorpay order ID
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Reference to booking
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentType: {
    type: String,
    enum: ['advance', 'full'],
    required: true
  },
  
  // Order status
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'created'
  },
  
  // Razorpay payment details
  paymentId: {
    type: String // Razorpay payment ID after successful payment
  },
  signature: {
    type: String // Razorpay signature for verification
  },
  
  // Refund details
  refundId: {
    type: String // Razorpay refund ID
  },
  refundAmount: {
    type: Number
  },
  refundReason: {
    type: String
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  
  // Metadata
  notes: {
    type: mongoose.Schema.Types.Mixed
  }
});

// Index for faster queries
orderSchema.index({ orderId: 1 });
orderSchema.index({ bookingId: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);