// availability.model.js
import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: String,  // Format: "HH:MM" (24-hour format)
  endTime: String,    // Format: "HH:MM" (24-hour format)
  isAvailable: Boolean
});

const availabilitySchema = new mongoose.Schema({

  date: {
    type: Date,
    required: true
  },
  timeSlots: [timeSlotSchema],
  isFullyBooked: {
    type: Boolean,
    default: false
  },
  bookings: [{
    slotStartTime: String,
    slotEndTime: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    bookingDateTime: {
      type: Date,
      default: Date.now
    }
  }],
  studioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'partnerStudio',
    required: function() {
      return !this.freelancerId;
    }
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer', 
    required: function() {
      return !this.studioId;
    }
  },
    },
{
  timestamps: true
});

// Updated compound indices for better query performance
// Removed uniqueness constraint since multiple studios/freelancers can share the same date
availabilitySchema.index({ studioId: 1, date: 1 }, { sparse: true });
availabilitySchema.index({ freelancerId: 1, date: 1 }, { sparse: true });

export default mongoose.model('Availability', availabilitySchema);