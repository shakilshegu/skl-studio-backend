import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', ServiceSchema);

export default Service;
