import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
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
      ref: 'Studio',
      required: function() {
        return !this.freelancerId;
      }
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer', 
      required: function() {
        return !this.studioId;
      }
    }
  },
  {
    timestamps: true,
  }
);

// Add a validation to ensure at least one of studioId or freelancerId is provided
EquipmentSchema.pre('validate', function(next) {
  if (!this.studioId && !this.freelancerId) {
    this.invalidate('studioId', 'Either studioId or freelancerId must be provided');
    this.invalidate('freelancerId', 'Either studioId or freelancerId must be provided');
  }
  next();
});

const Equipment = mongoose.model('Equipment', EquipmentSchema);

export default Equipment;