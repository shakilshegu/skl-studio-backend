import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpCode: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: Date.now,
    get: (otpExpiration) => otpExpiration.getTime()
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Auth = mongoose.model('Auth', authSchema);

export default Auth;
