// models/Portfolio.js
import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Portfolio title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Wedding', 'Event', 'Other']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  images: {
    type: [String], 
    required: true,
    validate: [array => array.length > 0, 'At least one image is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Create index for better query performance
portfolioSchema.index({ category: 1, user: 1 });

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
