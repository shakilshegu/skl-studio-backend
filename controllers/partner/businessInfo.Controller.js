import BusinessProfile from '../../models/partner/businessInfo.model.js';
import User from '../../models/userModel.js';

// Create new business profile
export const createBusinessProfile = async (req, res) => {
  
  try {

    const userId = req.user._id; 
    
    const {
      vendorName,
      vendorType = 'Freelancer',
      teamSize,
      country = 'India',
      state,
      city,
      instagramHandle,
      categoriesSpecialized = [],
      equipmentList = [],
      avgBookingDays,
      inHouseDesigner,
      traveledOutsideCountry = false,
      countriesTraveled, 
      eventsOutsideCountry, 
      traveledOutsideCity = false,
      citiesTraveled,
      eventsOutsideCity , 
      openToTravel = false
    } = req.body;

    console.log(inHouseDesigner,"==========");
    

    // Check if profile already exists
    const existingProfile = await BusinessProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Business profile already exists for this user"
      });
    }

    const businessProfile = new BusinessProfile({
      user: userId,
      vendorName,
      vendorType,
      teamSize,
      country,
      state,
      city,
      instagramHandle,
      categoriesSpecialized,
      equipmentList,
      avgBookingDays,
      inHouseDesigner,
      traveledOutsideCountry,
      countriesTraveled, 
      eventsOutsideCountry, 
      traveledOutsideCity,
      citiesTraveled, // Now a simple array of strings
      eventsOutsideCity, // New field
      openToTravel
    });
    
    let businessData= await businessProfile.save();

    // Update user to mark as partner
   let updatedUser = await User.findByIdAndUpdate(userId, {
      businessProfile: businessData._id,
      isPartner: true,
      $addToSet: { roles: vendorType }
    });

    // Make sure to get the latest roles from DB after update
const freshUser = await User.findById(userId);

let roleToReturn;
if (freshUser.roles.length === 1) {
  roleToReturn = freshUser.roles[0];
} else {
  roleToReturn = freshUser.roles.find(role => role.toLowerCase() !== 'user');
}

res.status(201).json({
  success: true,
  message: "Business profile created successfully",
  data: businessProfile,
  role: roleToReturn
});

  } catch (error) {
    console.error("Error creating business profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create business profile",
      error: error.message
    });
  }
};

// Get business profile for logged in user
export const getMyBusinessProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await BusinessProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Business profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch business profile",
      error: error.message
    });
  }
};

// Update business profile
export const updateBusinessProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileId = req.params.id;
    
    const {
      vendorName,
      vendorType,
      teamSize,
      country,
      state,
      city,
      instagramHandle,
      categoriesSpecialized,
      equipmentList,
      avgBookingDays,
      inHouseDesigner,
      traveledOutsideCountry,
      countriesTraveled, // Changed to simple array
      eventsOutsideCountry, // New field
      traveledOutsideCity,
      citiesTraveled, // Changed to simple array
      eventsOutsideCity, // New field
      openToTravel
    } = req.body;

    // Verify the profile belongs to the user
    const profile = await BusinessProfile.findOne({ _id: profileId, user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Business profile not found or not authorized"
      });
    }

    // Create update object with only the fields that are provided
    const updateData = {};
    if (vendorName) updateData.vendorName = vendorName;
    if (vendorType) updateData.vendorType = vendorType;
    if (teamSize) updateData.teamSize = teamSize;
    if (country) updateData.country = country;
    if (state) updateData.state = state;
    if (city) updateData.city = city;
    if (instagramHandle) updateData.instagramHandle = instagramHandle;
    if (categoriesSpecialized) updateData.categoriesSpecialized = categoriesSpecialized;
    if (equipmentList) updateData.equipmentList = equipmentList;
    if (avgBookingDays) updateData.avgBookingDays = avgBookingDays;
    if (inHouseDesigner !== undefined) updateData.inHouseDesigner = inHouseDesigner;
    
    // Handle travel data with simplified structure
    if (traveledOutsideCountry !== undefined) {
      updateData.traveledOutsideCountry = traveledOutsideCountry;
      // If set to false, clear arrays
      if (!traveledOutsideCountry) {
        updateData.countriesTraveled = [];
        updateData.eventsOutsideCountry = [];
      } else if (countriesTraveled) {
        updateData.countriesTraveled = countriesTraveled;
      }
    }
    if (eventsOutsideCountry) updateData.eventsOutsideCountry = eventsOutsideCountry;
    
    if (traveledOutsideCity !== undefined) {
      updateData.traveledOutsideCity = traveledOutsideCity;
      // If set to false, clear arrays
      if (!traveledOutsideCity) {
        updateData.citiesTraveled = [];
        updateData.eventsOutsideCity = [];
      } else if (citiesTraveled) {
        updateData.citiesTraveled = citiesTraveled;
      }
    }
    if (eventsOutsideCity) updateData.eventsOutsideCity = eventsOutsideCity;
    
    if (openToTravel !== undefined) updateData.openToTravel = openToTravel;
    
    updateData.updatedAt = Date.now();

    const updatedProfile = await BusinessProfile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Business profile updated successfully",
      data: updatedProfile
    });
  } catch (error) {
    console.error("Error updating business profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update business profile",
      error: error.message
    });
  }
};

// Get all business profiles (admin only)
export const getAllBusinessProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, vendorType, city, state } = req.query;
    
    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Add filters if needed
    const filters = {};
    if (vendorType) filters.vendorType = vendorType;
    if (city) filters.city = city;
    if (state) filters.state = state;

    const profiles = await BusinessProfile.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email phone');

    const total = await BusinessProfile.countDocuments(filters);

    res.status(200).json({
      success: true,
      count: profiles.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch business profiles",
      error: error.message
    });
  }
};

// Delete business profile
export const deleteBusinessProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileId = req.params.id;

    // Verify the profile belongs to the user
    const profile = await BusinessProfile.findOne({ _id: profileId, user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Business profile not found or not authorized"
      });
    }

    await BusinessProfile.findByIdAndDelete(profileId);

    // Update user to mark as not a partner anymore (optional)
    await User.findByIdAndUpdate(userId, { isPartner: false });

    res.status(200).json({
      success: true,
      message: "Business profile deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete business profile",
      error: error.message
    });
  }
};