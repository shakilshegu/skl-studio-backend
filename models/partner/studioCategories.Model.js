import mongoose from 'mongoose';

const studioCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true, 
  },
}, { timestamps: true });

const StudioCategory = mongoose.model('StudioCategory', studioCategorySchema);

export default StudioCategory;