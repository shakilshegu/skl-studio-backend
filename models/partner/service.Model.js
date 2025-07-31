import mongoose from "mongoose";

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
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio",
      required: function () {
        return !this.freelancerId;
      },
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
      required: function () {
        return !this.studioId;
      },
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

// Add a validation to ensure at least one of studioId or freelancerId is provided
ServiceSchema.pre("validate", function (next) {
  if (!this.studioId && !this.freelancerId) {
    this.invalidate(
      "studioId",
      "Either studioId or freelancerId must be provided"
    );
    this.invalidate(
      "freelancerId",
      "Either studioId or freelancerId must be provided"
    );
  }
  next();
});

const Service = mongoose.model("Service", ServiceSchema);

export default Service;
