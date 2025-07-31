import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    photo: {
      type: String,
      required: true,
    },
    isDeleted:{
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('admin_packages', PackageSchema);

export default Package;
