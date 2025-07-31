import crypto from 'crypto';

export const generateOTP = (digits) => {
    const otp = crypto.randomInt(1000, 9999);
    return otp.toString();
  }
