// controllers/FreelancerController.js
import FreelancerModel from "../../models/partner/freelancer.model.js";
import fs from 'fs';
import path from 'path';
import { deleteS3File, uploadFile } from "../../utils/media.helper.js";
import EventCategory from "../../models/admin/eventCategory.model.js";

// Get freelancer by ID
export const getFreelancerByUserId = async (req, res) => {
  try {
const userId = req.user._id
    
    const freelancer = await FreelancerModel.findOne({user:userId}).populate('categories'); 
    return res.status(200).json({
      success: true,
      freelancer: freelancer || null,
      message: freelancer ? "freelancer found":"No freelancer found"
    });
    
  } catch (error) {
    console.error(`Error fetching freelancer with id ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch freelancer',
      error: error.message
    });
  }
};
export const getFreelancerCategories = async (req, res) => {
  try {
  
    const categories = await EventCategory.find();
  
    return res.status(200).json({
      success: true,
      categories: categories || null,
      message: categories ? "Categories found":" No categories found"
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

export const createFreelancer = async (req, res) => {
  try {
    const { name, age, description, categories, location, experience, pricePerHour } = req.body;
    
    // Check for required profile image
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Profile image is required'
      });
    }
    
    const userId = req.user._id;

    const photoUrl = await uploadFile(file, `freelancer/${userId}/${file.filename}`);
    
    // Parse categories if it comes as a string (from form data)
    let parsedCategories = categories;
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (e) {
        // If it's a single category ID as a string
        parsedCategories = [categories];
      }
    }

    // Ensure categories is an array
    if (!Array.isArray(parsedCategories)) {
      parsedCategories = [parsedCategories];
    }

    // Create the freelancer with all required fields
    const newFreelancer = await FreelancerModel.create({
      name,
      age,
      description: description || '',
      categories: parsedCategories,
      location,
      experience,
      pricePerHour,
      user: userId,
      profileImage: photoUrl
    });
    
    return res.status(201).json({
      success: true,
      message: 'Freelancer profile created successfully!',
      data: {
        freelancerId: newFreelancer._id
      }
    });
  } catch (error) {
    console.error('Error creating freelancer:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create freelancer profile',
      error: error.message
    });
  }
};



export const updateFreelancer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, age, description, categories, location, experience, pricePerHour } = req.body;
    
    // Use findOne instead of find to get a single document (not an array)
    const freelancer = await FreelancerModel.findOne({ user: userId });
    
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: `No freelancer found`
      });
    }
    
    // Only update profile image if a new file is uploaded
    const file = req.file;
    let photoUrl;
    
    if (file) {
      photoUrl = await uploadFile(file, `freelancer/${userId}/${file.filename}`);
      
      // Optional: Delete old image file from storage
      // if (freelancer.profileImage) {
      //   await deleteS3File(freelancer.profileImage);  //super admin access denied
      // }
      
      // Update image only if a new one is provided
      freelancer.profileImage = photoUrl;
    }

    // Parse categories if it comes as a string (from form data)
    let parsedCategories = categories;
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (e) {
        // If it's a single category ID as a string
        parsedCategories = [categories];
      }
    }
    
    // Ensure categories is an array
    if (!Array.isArray(parsedCategories)) {
      parsedCategories = [parsedCategories];
    }
    
    // Update data fields
    freelancer.name = name;
    freelancer.age = age;
    freelancer.description = description || '';
    freelancer.categories = parsedCategories; // Use the parsed categories
    freelancer.location = location;
    freelancer.experience = experience;
    freelancer.pricePerHour = pricePerHour;
    
    await freelancer.save();
    
    return res.status(200).json({
      success: true,
      message: 'Freelancer profile updated successfully!',
      data: freelancer
    });
  } catch (error) {
    console.error(`Error updating freelancer `, error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update freelancer profile',
      error: error.message
    });
  }
};

// Delete freelancer
export const deleteFreelancer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const freelancer = await FreelancerModel.findById(id);
    
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: `No freelancer found with id: ${id}`
      });
    }
    
    // Remove profile image if exists
    if (freelancer.profileImage) {
      const imagePath = path.join(__dirname, '..', 'public', freelancer.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await FreelancerModel.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: 'Freelancer profile deleted successfully!'
    });
  } catch (error) {
    console.error(`Error deleting freelancer with id ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete freelancer profile',
      error: error.message
    });
  }
};
