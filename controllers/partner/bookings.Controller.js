// controllers/bookingController.js

import Booking from '../../models/user/booking.model.js';
import { getEntityId } from '../../utils/roleUtils.js';


// Get bookings for authenticated entity
export const getMyBookings = async (req, res) => {
  try {
    const { isStudio, isFreelancer } = req; // From protect middleware
    const { status, page = 1, limit = 10 } = req.query;
    
    const { entityId, entityType } = await getEntityId(req);
    

    console.log(entityId,"eid");
    

    let query = { entityId };
    let populateField = '';
    
    if (isStudio) {
      populateField = 'studioId';
    } else if (isFreelancer) {
      populateField = 'freelancerId';
    } else {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Only studios and freelancers can access bookings.' 
      });
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate('userId', 'name email mobile profileImage')
      .populate(populateField, 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Booking.countDocuments(query);
console.log(bookings,"bbbbbb");


    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;
    const { user, isStudio, isFreelancer } = req;

    if (!isStudio && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only studios and freelancers can update booking status.'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'in-progress'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Find booking and verify ownership
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify that this booking belongs to the authenticated entity
    const { entityId } = await getEntityId(req);
    
    if (booking.entityId.toString() !== entityId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this booking'
      });
    }

    // Update booking status
    booking.status = status;
    
    const timestamp = new Date().toISOString();
    const entityType = isStudio ? 'studio' : 'freelancer';
    const statusNote = `[${timestamp}] Status updated to ${status} by ${entityType}`;
    
    if (notes) {
      booking.notes = (booking.notes || '') + `\n${statusNote}: ${notes}`;
    } else {
      booking.notes = (booking.notes || '') + `\n${statusNote}`;
    }

    // Handle specific status changes
    if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      if (notes) {
        booking.cancellationReason = notes;
      }
    }

    if (status === 'in-progress') {
      booking.actualStartTime = new Date();
    }

    if (status === 'completed') {
      booking.actualEndTime = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { user, isStudio, isFreelancer } = req;

    if (!isStudio && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email phone profileImage')
      .populate('studioId', 'name location')
      .populate('freelancerId', 'name location');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify that this booking belongs to the authenticated entity
    const { entityId } = await getEntityId(req);
    
    if (booking.entityId.toString() !== entityId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};