import mongoose from 'mongoose';

const studioSchema = new mongoose.Schema({
  studioName: { type: String, required: true },
  studioStartedDate:{ type: Date, required: true },
  studioLogo: { type: String, required: true },
  studioEmail: { type: String, required: true },
  studioMobileNumber: { type: String, required: true },
  gstNumber: { type: String, required: true },
  address: {
    addressLineOne: { type: String, required: true },
    addressLineTwo: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  studioDescription: { type: String, required: true },

  // Owner Information
  owner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudioCategory',
    required: true,
  },
  isVerified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Partner Information
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
  },

  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  // Gallery
  images: [{ type: String }],
  videos: { type: String },

}, { timestamps: true });

const Studio = mongoose.model('partnerstudios', studioSchema);
export default Studio;
