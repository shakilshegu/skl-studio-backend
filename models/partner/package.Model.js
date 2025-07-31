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
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: true,
    },
    isDeleted:{
      type: Boolean,
      default: false
    },
    equipments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment', 
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', 
      },
    ],
  },
 
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', PackageSchema);

export default Package;
