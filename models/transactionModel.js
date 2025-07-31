import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    paymentMethod: {
      type: String, // For example: "Credit Card", "PayPal", etc.
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
      default: 'pending',
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  });
  

  const Transaction = mongoose.model('Transaction',transactionSchema);
  export default Transaction;