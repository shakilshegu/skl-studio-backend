import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Reference to the EquipmentCategory model
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // brand: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // model: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    description: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      required: true,
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
    // currentStock: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },
    // totalQuantity: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Reference to the User model
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio', // Reference to the Studio model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Equipment = mongoose.model('Equipment', EquipmentSchema);

export default Equipment;