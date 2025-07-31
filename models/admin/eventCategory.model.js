// models/EventCategory.js
import mongoose from 'mongoose';

const eventCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const EventCategory = mongoose.model('EventCategory', eventCategorySchema);

export default EventCategory;