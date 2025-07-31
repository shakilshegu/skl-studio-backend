// models/partner/freelancer.model.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FreelancerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  description: {
    type: String,
    trim: true
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'EventCategory',
    required: [true, 'At least one category is required']
  }],
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required']
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price Per Hour is required']
  },
  profileImage: {
    type: String,
    required: [true, 'Profile image is required']
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a text index for search functionality
FreelancerSchema.index({ 
  name: 'text', 
  location: 'text', 
  description: 'text' 
});

const FreelancerModel = mongoose.model('Freelancer', FreelancerSchema);

export default FreelancerModel;