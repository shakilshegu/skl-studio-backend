import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      validate: {
        validator: (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
        message: "Please enter a valid phone number",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [String],
      enum: ["user", "studio", "freelancer"],
      default: ["user"],
    },
    accessToken: {
      type: String,
      default: null,
    },
    businessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set isVerified to true for super-admin
userSchema.pre("save", function (next) {
  if (this.roles.includes("super-admin")) {
    this.isVerified = true;
  }
  next();
});

export default mongoose.model("User", userSchema);
