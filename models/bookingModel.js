import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true,
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
  },
  equipments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
  }],
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  packages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending','partially-paid', 'paid'],
    default: 'pending',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  transactionId: String,
});
const Booking = mongoose.model('Booking',bookingSchema)
export default Booking