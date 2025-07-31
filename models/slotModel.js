import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  studioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  rateType: {
    type: String,
    enum: ["both", "hourly", "daily"],
    required: true,
  },
  hourlyPrice: {
    type: Number,
    required: function () {
      return this.rateType === "hourly" || this.rateType === "both";
    },
  },
  dailyPrice: {
    type: Number,
    required: function () {
      return this.rateType === "daily" || this.rateType === "both";
    },
  },
  slots: [
    {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      status: {
        type: String,
        enum: ["available", "booked", "unavailable"],
        default: "available",
      },
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
          return this.status === "booked";
        },
      },
    },
  ],
  slotBookingPercentage: {
    type: Number,
    default: 0,
  },
});

// Middleware to calculate slotBookingPercentage before saving
slotSchema.pre('save', function (next) {
  const totalSlots = this.slots.length;
  const bookedSlots = this.slots.filter(slot => slot.status === 'booked').length;
  this.slotBookingPercentage = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
  next();
});

const Slot = mongoose.model('Slot', slotSchema);
export default Slot;