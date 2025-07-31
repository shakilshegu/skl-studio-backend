import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Ensure the file extension is included
import { generateOTP }   from '../utils/utils.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Middleware to check role
export const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};

// Get all users (Admin access only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID (Admin, Supreme access only)
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new user (Registration)
export const createUser = async (req, res) => {
  try {
    const { role, name, email, password, studioName } = req.body;
    if (!role || !name || !email || !password || !studioName) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const newUser = await userService.createUser(req.body);
    const profileData = {
      user: newUser._id,
      role,
      profilePic: req.body.profilePic || '',
      contactInfo: req.body.contactInfo || {},
      socialMediaLinks: req.body.socialMediaLinks || [],
      notificationPreferences: req.body.notificationPreferences || {},
      digitalWallet: req.body.digitalWallet || {},
    };

    const newProfile = await profileService.createProfile(newUser._id, profileData);

    res.status(201).json({ user: newUser, profile: newProfile });
  } catch (error) {
    console.error('Error creating user and profile:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { token, user } = await userService.loginUser(req.body.email, req.body.password);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user (Admin, Supreme access)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const updatedUser = await userService.updateUser(id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Register a new user
export const adminRegister = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;

    if (!roles.includes('super-admin') && !roles.includes('admin')) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // const hashedPassword = bcrypt.hashSync(password, 8);
    const hashedPassword = password; // For testing purposes

    const user = new User({
      name,
      email,
      password: hashedPassword,
      roles,
    });

    await user.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
export const adminLogin = async (req, res) => {
  try {
    debugger;
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Admin not approved' });
    }

    // const isPasswordValid = bcrypt.compareSync(password, user.password);
    const isPasswordValid = password === user.password; // For testing purposes
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign( {id:user._id} , '1234' , {
      expiresIn: 86400, // 24 hours
    });

    user.accessToken = token;
    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        accessToken: user.accessToken,    
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve admin
export const approveAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Replace the user's roles with 'admin'
    admin.roles = ['admin'];
    admin.isVerified = true;
    await admin.save();

    res.status(200).json({ message: 'Admin approved and role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change admin role to user
export const changeAdminRoleToUser = async (req, res) => {
  try {
    const { adminId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || !admin.roles.includes('admin')) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Replace the user's roles with 'user'
    admin.roles = ['user'];
    await admin.save();

    res.status(200).json({ message: 'Admin role changed to user successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send OTP for phone verification
export const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    const otp = generateOTP(4);
    const user = await userService.assignOTP(mobile, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP for login
export const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const result = await userService.verifyOTP(mobile, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Google login
export const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await userService.googleLogin(token);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Access Token and FCM Token
export const updateTokens = async (req, res) => {
  try {
    const { accessToken, fcmToken } = req.body;
    const userId = req.user._id; // Assuming req.user is set by authentication middleware

    const updatedUser = await userService.updateUser(userId, { accessToken, fcmToken });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Tokens updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};