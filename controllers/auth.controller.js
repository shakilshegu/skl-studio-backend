import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import OtpModel from "../models/auth.model.js";
import otpGenerator from "otp-generator";
import BusinessProfile from "../models/partner/businessProfile.model.js";
import { sendOTPMessage } from "../services/auth.service.js";
import { validateEmail } from "../utils/validators.js";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  try {
    const { username, password, isPartnerLogin } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide both username and password",
      });
    }

    // Find user by username
    const user = await User.findOne({ email: username });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    // Check if user has a business profile
    let isBusinessUser = false;
    const businessUser = await BusinessProfile.findOne({ user: user._id });
    if (businessUser) {
      isBusinessUser = true;
    }

    // Determine which role to use in token and response
    let roleToReturn;
    if (user.roles.length === 1 || !isPartnerLogin) {
      roleToReturn = user.roles[0];
    } else {
      // Find the first non-"user" role if multiple roles exist
      roleToReturn =
        (isPartnerLogin &&
          user.roles.find((role) => role.toLowerCase() !== "user")) ||
        user.roles[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        currentRole: roleToReturn,
      },
      process.env.JWT_SECRET,
      { expiresIn: "500h" }
    );

    // Remove password from user object
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Return success with token and user info matching OTP verification response
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: userWithoutPassword,
      isBusinessUser,
      role: roleToReturn,
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred during login",
    });
  }
};

const sendOTPHandler = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Generate a 4-digit numeric OTP
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const currentDate = new Date();

    // Save or update OTP in database
    await OtpModel.findOneAndUpdate(
      { mobileNumber },
      { otpCode: otp, otpExpiration: new Date(currentDate.getTime()) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP via SMS
    // await sendOTPMessage(mobileNumber, otp);

    return res.status(200).json({
      success: true,
      msg: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP Handler Error:", error);
    return res.status(400).json({
      success: false,
      msg: error.message || "Failed to send OTP",
    });
  }
};

const verifyOTPHandler = async (req, res) => {
  try {
    const { mobileNumber, otpCode } = req.body;

    // Validate input
    if (!mobileNumber || !otpCode) {
      return res.status(400).json({
        success: false,
        msg: "Mobile number and OTP code are required",
      });
    }

    // Find the OTP record for the given mobile number
    const otpRecord = await OtpModel.findOne({ mobileNumber });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        msg: "Mobile number not found",
      });
    }

    // Check if the OTP matches and is still valid
    const currentTime = new Date();
    if (
      otpRecord.otpCode !== otpCode ||
      new Date(otpRecord.expiryTime) < currentTime
    ) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired OTP",
      });
    }

    // Find or create user
    // Note: User model should have "user" as default role
    let user = await User.findOne({ mobile: mobileNumber });

    if (user) {
      // Existing user - just ensure verification
      user.isVerified = true;
    } else {
      // New user - will get default "user" role from model
      user = new User({
        mobile: mobileNumber,
        isVerified: true,
      });
    }

    await user.save();

    // Check if user has a business profile
    let isBusinessUser = false;
    const businessUser = await BusinessProfile.findOne({ user: user._id });
    if (businessUser) {
      isBusinessUser = true;
    }

    // Get fresh user data to ensure we have the latest roles
    const freshUser = await User.findById(user._id);

    // Determine which role to use in token and response
    let roleToReturn;
    if (freshUser.roles.length === 1) {
      roleToReturn = freshUser.roles[0];
    } else {
      // Find the first non-"user" role if multiple roles exist
      roleToReturn =
        freshUser.roles.find((role) => role.toLowerCase() !== "user") ||
        freshUser.roles[0];
    }

    // Generate JWT token with the determined role
    const token = jwt.sign(
      {
        id: freshUser._id,
        mobile: mobileNumber,
        currentRole: roleToReturn,
      },
      process.env.JWT_SECRET,
      { expiresIn: "500h" }
    );

    // Remove password from user object
    const userWithoutPassword = freshUser.toObject();
    delete userWithoutPassword.password;

    // Return success response with token and user data
    return res.status(200).json({
      success: true,
      msg: "OTP verified successfully",
      token,
      user: userWithoutPassword,
      isBusinessUser,
      role: roleToReturn,
    });
  } catch (error) {
    console.error("Verify OTP Handler Error:", error);
    return res.status(500).json({
      success: false,
      msg: error.message || "OTP verification failed",
    });
  }
};

const updateCredentials = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = req.user._id; // User ID from auth middleware

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Check if email already exists for another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already in use by another account",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        password: hashedPassword,
        // isEmailVerified: false // Email needs verification
      },
      { new: true } // Return updated document
    ).select("-password"); // Don't return password in response

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Optional: Send email verification link
    // await sendVerificationEmail(updatedUser.email, updatedUser._id);

    return res.status(200).json({
      success: true,
      message: "Credentials updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Error updating credentials:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while updating credentials",
    });
  }
};

const userCredentials = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId, "userId");
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Server Error", details: err.message });
  }
};

export {
  sendOTPHandler,
  verifyOTPHandler,
  login,
  updateCredentials,
  userCredentials,
};
