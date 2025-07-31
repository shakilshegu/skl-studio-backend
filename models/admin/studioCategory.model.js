// models/StudioCategory.js
import mongoose from 'mongoose';

const studioCategorySchema = new mongoose.Schema({
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

const StudioCategory = mongoose.model('StudioCategory', studioCategorySchema);

export default StudioCategory;