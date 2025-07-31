import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
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
  },
  bookingType: {
    type: String,
    enum: ['daily', 'hourly'],
    required: true,
  },
  dailySlots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: function () {
        return this.bookingType === 'daily';
      },
    },
  ],
  hourlySlots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: function () {
        return this.bookingType === 'hourly';
      },
    },
  ],
  slotTiming: {
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
  },
  equipments: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  services: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  packages: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  baseAmount: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  advanceAmount: { type: Number, default: 0 },
  onSiteAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'pending' },
  partialPayments: [
    {
      amount: { type: Number, required: true },
      status: { type: String, required: true },
      transactionDate: { type: Date, default: Date.now },
      modeOfPayment: {
        type: String,
        enum: ['online', 'offline'],
        required: true,
      },
      onlinePaymentDetails: {
        cardDetails: {
          cardNumber: { type: String },
          cardHolderName: { type: String },
          expiryDate: { type: String },
        },
        netBankingDetails: {
          bankName: { type: String },
          transactionId: { type: String },
        },
        qrTransactionDetails: {
          qrCode: { type: String },
          transactionId: { type: String },
        },
      },
      offlinePaymentDetails: {
        paymentMethod: { type: String }, // e.g., cash, cheque
        receiptNumber: { type: String },
      },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },
  invoiceNumber: {
    type: String,
    required: function () {
      return this.status === 'completed';
    },
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Enable timestamps

// Middleware to calculate remainingAmount and update paymentStatus
cartSchema.pre('save', function (next) {
  const cart = this;
  const totalPaid = cart.partialPayments.reduce((sum, payment) => sum + payment.amount, 0);
  cart.remainingAmount = cart.totalAmount - totalPaid;

  if (totalPaid >= cart.totalAmount) {
    cart.paymentStatus = 'paid';
  } else if (totalPaid > 0) {
    cart.paymentStatus = 'partial';
  } else {
    cart.paymentStatus = 'pending';
  }

  next();
});

// Middleware to validate numeric fields are not NaN
cartSchema.pre('validate', function (next) {
  const cart = this;

  const ensureNumber = (value) => isNaN(value) ? 0 : value;

  cart.baseAmount = ensureNumber(cart.baseAmount);
  cart.gstAmount = ensureNumber(cart.gstAmount);
  cart.totalAmount = ensureNumber(cart.totalAmount);
  cart.advanceAmount = ensureNumber(cart.advanceAmount);
  cart.onSiteAmount = ensureNumber(cart.onSiteAmount);
  cart.remainingAmount = ensureNumber(cart.remainingAmount);

  next();
});

// Virtual property to dynamically calculate status based on current time and booking time
cartSchema.virtual('dynamicStatus').get(function () {
  const now = new Date();
  const startTime = new Date(this.slotTiming.startTime);
  const endTime = new Date(this.slotTiming.endTime);

  if (now < startTime) {
    return 'upcoming';
  } else if (now >= startTime && now <= endTime) {
    return 'ongoing';
  } else if (now > endTime) {
    return 'completed';
  } else {
    return this.status;
  }
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;