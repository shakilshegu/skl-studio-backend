import mongoose from 'mongoose';

const HelperSchema = new mongoose.Schema(
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
        studioId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Studio',
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

const Helper = mongoose.model('Helper', HelperSchema);

export default Helper;
