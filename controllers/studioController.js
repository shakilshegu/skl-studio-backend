import mongoose from 'mongoose';
import { getS3FileUrl, uploadFile } from '../utils/mediaHelper.js';
import { sendResponse } from '../utils/responseUtils.js';
import Slot from '../models/slotModel.js'
import Cart from '../models/cartModel.js';
import Studio from '../models/partner/studio.Model.js';
import StudioCategory from '../models/partner/studioCategories.Model.js';


export const getStudiosOnAllCategories = async (req, res) => {
  try {
    const studios = await Studio.find({ isVerified: true, isDeleted: false });
    const categories = await StudioCategory.find().select('name image');

    // Fetch studios for each category, limited to 2 studios per category
    const categoriesWithStudios = await Promise.all(
      categories.map(async (category) => {
        const studios = await Studio.find({ isVerified: true, type: category._id, isDeleted: false }).limit(2);
        return {
          category: category.name,
          categoryImage: category.image,
          studios,
        };
      })
    );

    return sendResponse(res, true, 'Categories with studios retrieved successfully.', categoriesWithStudios);
  } catch (error) {
    console.error('Error fetching categories with studios:', error);
    return sendResponse(res, false, 'Error fetching categories with studios', null, error.message);
  }
};

export const getCategoryStudios = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await StudioCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const studios = await Studio.find({ type: categoryId })
      .select('name studioEmail studioMobileNumber studioDescription title price images')
      .populate('type', 'name image'); // Populate category fields (name, image)
    if (studios.length === 0) {
      return res.status(404).json({ message: 'No studios found for this category' });
    }
    res.status(200).json({
      success: true,
      studios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getAllStudios = async (req, res) => {
  try {
    debugger;

    const { type } = req.query;

    const query = { isDeleted: false, isVerified: true };

    if (type) {
      query.type = type;

    }
    const studios = await Studio.find(query);
    res.status(200).json(studios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllStudioCategoriesWithStudios = async (req, res) => {
  try {
    console.log("getAllStudioCategoriesWithStudios");
    // Fetch all studio categories
    const categories = await StudioCategory.find();

    // Fetch studios for each category, limited to 2 studios per category
    const categoriesWithStudios = await Promise.all(
      categories.map(async (category) => {
        const studios = await Studio.find({ type: category.name }).limit(2);
        return {
          category: category.name,
          studios,
        };
      })
    );

    return sendResponse(res, true, 'Categories with studios retrieved successfully.', categoriesWithStudios);
  } catch (error) {
    console.error('Error fetching categories with studios:', error);
    return sendResponse(res, false, 'Error fetching categories with studios', null, error.message);
  }
};

export const getStudioById = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id)
    if (!studio || studio.isDeleted) {
      return res.status(404).json({ message: 'Studio not found' });
    }
    res.status(200).json(studio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudiosByFilter = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, ratings, type, date, startTime, endTime, lat, lng, maxDistance } = req.query;

    const studioQuery = {};
    let parsedDate = null; // Moved declaration outside the if block

    // Previous filters remain the same...
    if (location) {
      studioQuery['address.city'] = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return res.status(400).json({
          success: false,
          message: 'minPrice should be less than or equal to maxPrice'
        });
      }
      studioQuery['price.perDay'] = {};
      if (minPrice) studioQuery['price.perDay'].$gte = Number(minPrice);
      if (maxPrice) studioQuery['price.perDay'].$lte = Number(maxPrice);
    }

    if (ratings) {
      studioQuery['reviews.rating'] = { $gte: Number(ratings) };
    }

    if (type) {
      studioQuery.type = type;
    }

    // Updated date and time filtering
    if (date && startTime && endTime) {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format, please provide a valid date.'
        });
      }

      // Create the full ISO date-time strings for comparison
      const startDateTime = new Date(`${date}T${startTime}:00.000Z`);
      const endDateTime = new Date(`${date}T${endTime}:00.000Z`);

      console.log('Searching for slots with:', {
        date: parsedDate,
        startDateTime,
        endDateTime
      });

      // Find available slots with updated time comparison
      const availableSlots = await Slot.find({
        date: parsedDate,
        slots: {
          $not: {
            $elemMatch: {
              status: 'available',
              $or: [
                {
                  startTime: { $lt: endDateTime },
                  endTime: { $gt: startDateTime }
                }
              ]
            }
          }
        }
      }).select('studioId');

      if (availableSlots.length > 0) {
        const availableStudioIds = availableSlots.map(slot => slot.studioId);
        studioQuery._id = { $in: availableStudioIds };
      } else {
        return res.status(404).json({
          success: false,
          message: 'No studios available for the selected time slot.'
        });
      }
    }
    const studios = await Studio.find(studioQuery)
      .populate('type')
      .populate('reviews.user', 'name email')
      .lean();

    if (studios.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No studios found matching the given criteria.'
      });
    }
    debugger;
    let filteredStudios = studios;
    if (lat && lng && maxDistance) {
      const maxDistanceInMeters = Number(maxDistance) * 1000;
      filteredStudios = studios.filter(studio => {
        const distance = calculateDistance(lat, lng, studio.location.lat, studio.location.lng);
        return distance <= maxDistanceInMeters;
      });
    }

    const studiosWithDetails = filteredStudios.map(studio => ({
      ...studio,
      availability: date && startTime && endTime ? {
        date: parsedDate, // Now parsedDate is available here
        startTime,
        endTime,
        status: 'available'
      } : undefined
    }));

    return res.status(200).json({
      success: true,
      message: 'Studios retrieved successfully.',
      count: studiosWithDetails.length,
      data: studiosWithDetails
    });

  } catch (error) {
    console.error('Error fetching studios by filter:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching studios by filter.',
      error: error.message
    });
  }
};


function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// get available studios by date, time range, and city
export const getAvailableStudios = async (req, res) => {
  try {
    const { date, startTime, endTime, city } = req.query;
 
    if (!date || !startTime || !endTime || !city) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
 
    const parsedDate = new Date(date);
    const startDateTime = new Date(`${date}T${startTime}:00.000Z`);
    const endDateTime = new Date(`${date}T${endTime}:00.000Z`);
 
    const availableSlots = await Slot.find({
      date: parsedDate,
      slots: {
        $not: {
          $elemMatch: {
            status: 'available',
            $or: [
              {
                startTime: { $lt: endDateTime },
                endTime: { $gt: startDateTime }
              }
            ]
          }
        }
      }
    })
    .select('studioId')
    .populate({
      path: 'studioId',
      model: 'partnerstudios',
      match: { 'address.city': city }
    });
 
    if (availableSlots.length === 0) {
      return res.status(404).json({ message: 'No available studios found' });
    }
 
    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
 };


// get booking details by User-id

export const getBookingDetailsByDateRange = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.query;

    if (!userId || !fromDate || !toDate) {
      return res.status(400).json({ message: "userId, fromDate, and toDate are required" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const currentDate = new Date();

    // Find slots within the date range
    const slots = await Slot.find({
      date: { $gte: from, $lte: to }
    }).select('_id date slotTiming');

    const slotIds = slots.map(slot => slot._id);

    // Find carts based on userId, slotIds, and paymentStatus not equal to pending
    const carts = await Cart.find({
      user: userId,
      slot: { $in: slotIds },
      paymentStatus: { $ne: 'pending' }
    }).populate('user studio slot equipments.id services.id packages.id');

    // Initialize the result object
    const result = {};

    // Group carts by date and categorize them
    carts.forEach(cart => {
      const slot = slots.find(slot => slot._id.equals(cart.slot));
      const bookingDate = new Date(slot.date).toISOString().split('T')[0]; // Format date as YYYY-MM-DD

      if (!result[bookingDate]) {
        result[bookingDate] = {
          date: bookingDate,
          count: 0,
          upcoming: [],
          ongoing: [],
          cancelled: [],
          completed: []
        };
      }

      const startTime = new Date(`${slot.date}T${cart.slotTiming.startTime}`);
      const endTime = new Date(`${slot.date}T${cart.slotTiming.endTime}`);

      if (cart.paymentStatus === 'cancelled') {
        if (new Date(slot.date) >= currentDate) {
          result[bookingDate].cancelled.push(cart);
        } else {
          result[bookingDate].completed.push(cart);
        }
      } else if (new Date(slot.date) > currentDate) {
        result[bookingDate].upcoming.push(cart);
      } else if (new Date(slot.date) < currentDate) {
        result[bookingDate].completed.push(cart);
      } else {
        if (currentDate >= startTime && currentDate <= endTime) {
          result[bookingDate].ongoing.push(cart);
        } else if (currentDate < startTime) {
          result[bookingDate].upcoming.push(cart);
        } else {
          result[bookingDate].completed.push(cart);
        }
      }

      result[bookingDate].count += 1;
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching cart details", error });
  }
};

export const randomStudios = async (req, res) => {
  try {
    const studios = await Studio.find({}, 'price images studioDescription title'); // Select only required fields
    res.status(200).json(studios);
  } catch (error) {
    console.error('Error fetching studios:', error);
    res.status(500).json({ message: 'Failed to fetch studios', error });
  }
}









