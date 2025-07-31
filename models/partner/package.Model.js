import mongoose from "mongoose";

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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    equipments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },

  {
    timestamps: true,
  }
);

// Add a validation to ensure at least one of studioId or freelancerId is provided
PackageSchema.pre("validate", function (next) {
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

const Package = mongoose.model("Package", PackageSchema);

export default Package;
