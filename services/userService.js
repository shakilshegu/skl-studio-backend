const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const config = require('../config/index');

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Error fetching user by ID: ' + error.message);
  }
};

// Create new user
const createUser = async (userData) => {
  const { email, password, role, studioName } = userData;
  if (!studioName) throw new Error('studioName is required for user creation');

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User with this email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    ...userData,
    password: hashedPassword,
    isVerified: false, // Default to false until verification
  });

  return await newUser.save();
};

// Login user
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return { token, user: { id: user._id, role: user.role, name: user.name, email: user.email, profilePic: user.profilePic } };
};

// Update user
const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};

// Delete user
const deleteUser = async (id) => {
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new Error('User not found');
};

// Send OTP for phone verification
const sendOTP = async (phoneNumber, otp) => {
  const user = await User.findOne({ mobile: phoneNumber });
  if (!user) throw new Error('User with the given phone number does not exist');
  user.otp = otp;
  await user.save();
  return user;
};

// Verify OTP
const verifyOTP = async (phoneNumber, otp) => {
  const user = await User.findOne({ mobile: phoneNumber });
  if (!user || user.otp !== otp) throw new Error('Invalid OTP');
  
  // Set isVerified to true after successful OTP verification
  user.isVerified = true;
  user.otp = null; // Clear OTP after successful verification
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
  return { token, user: { id: user._id, role: user.role, name: user.name, email: user.email } };
};

// Google login
const googleLogin = async (token) => {
  const oauth2Client = new google.auth.OAuth2(config.google.clientId, config.google.clientSecret);
  const ticket = await oauth2Client.verifyIdToken({ idToken: token, audience: config.google.clientId });
  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    // If no user exists, create a new one with 'Guest' role
    const newUser = new User({
      name: payload.name,
      email: payload.email,
      profilePic: payload.picture,
      role: 'Guest',
      isVerified: true,
    });
    user = await newUser.save();
  }

  const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
  return { token: jwtToken, user: { id: user._id, role: user.role, name: user.name, email: user.email, profilePic: user.profilePic } };
};

// Update tokens for user
const updateTokens = async (userId, tokenData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.accessToken = tokenData.accessToken || user.accessToken;
  user.fcmToken = tokenData.fcmToken || user.fcmToken;
  await user.save();

  return { message: 'Tokens updated successfully', user };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  sendOTP,
  verifyOTP,
  googleLogin,
  updateTokens,
};
