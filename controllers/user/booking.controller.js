// // controllers/booking.controller.js
// import Booking from '../models/booking.model.js';
// import Slot from '../models/slot.model.js';
// import Studio from '../models/partner/studio.model.js';
// import Freelancer from '../models/partner/freelancer.model.js';
// import mongoose from 'mongoose';

// // Create a new booking
// export const createBooking = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const {
//       bookingType,
//       studioId,
//       freelancerId,
//       slotId,
//       fromSlotId,
//       toSlotId,
//       rateType,
//       selectedPackages,
//       selectedServices,
//       selectedEquipments,
//       selectedHelpers,
//       additionalCosts,
//       specialRequests,
//       paymentMethod,
//       advanceAmount
//     } = req.body;
    
//     const userId = req.user._id; // Assuming user is authenticated
    
//     // Validate booking type
//     if (!bookingType || (bookingType !== 'studio' && bookingType !== 'freelancer')) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid booking type. Must be either studio or freelancer.' 
//       });
//     }
    
//     // Validate required fields based on booking type
//     if (bookingType === 'studio' && !studioId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Studio ID is required for studio bookings.' 
//       });
//     }
    
//     if (bookingType === 'freelancer' && !freelancerId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Freelancer ID is required for freelancer bookings.' 
//       });
//     }
    
//     // Check if the studio or freelancer exists
//     let serviceProvider;
//     if (bookingType === 'studio') {
//       serviceProvider = await Studio.findById(studioId);
//       if (!serviceProvider) {
//         return res.status(404).json({ 
//           success: false, 
//           message: 'Studio not found.' 
//         });
//       }
      
//       // Validate studio is verified and not deleted
//       if (!serviceProvider.isVerified || serviceProvider.isDeleted) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Studio is not available for booking.' 
//         });
//       }
//     } else {
//       serviceProvider = await Freelancer.findById(freelancerId);
//       if (!serviceProvider) {
//         return res.status(404).json({ 
//           success: false, 
//           message: 'Freelancer not found.' 
//         });
//       }
//     }
    
//     // Check if slot exists
//     const slot = await Slot.findById(slotId);
//     if (!slot) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Slot not found.' 
//       });
//     }
    
//     // Validate slot belongs to the selected studio/freelancer
//     const providerId = bookingType === 'studio' ? studioId : freelancerId;
//     if (slot.studioId.toString() !== providerId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Slot does not belong to the selected ${bookingType}.` 
//       });
//     }
    
//     // Check if the rate type is available for this slot
//     if (slot.rateType !== 'both' && slot.rateType !== rateType) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `The selected rate type (${rateType}) is not available for this slot.` 
//       });
//     }
    
//     // Validate fromSlotId and toSlotId
//     if (!fromSlotId || !toSlotId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'From and To slot IDs are required.' 
//       });
//     }
    
//     // Find the from and to slot items
//     const fromSlot = slot.slots.id(fromSlotId);
//     const toSlot = slot.slots.id(toSlotId);
    
//     if (!fromSlot) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'From slot not found in the slot document.' 
//       });
//     }
    
//     if (!toSlot) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'To slot not found in the slot document.' 
//       });
//     }
    
//     // Ensure from slot comes before to slot
//     const fromHour = parseInt(fromSlot.startTime.split(':')[0]);
//     const toHour = parseInt(toSlot.startTime.split(':')[0]);
    
//     if (fromHour >= toHour) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'From slot must be earlier than To slot.' 
//       });
//     }
    
//     // Check if all slots between from and to are available
//     let allSlotsAvailable = true;
//     let unavailableSlot = null;
    
//     for (let hour = fromHour; hour < toHour; hour++) {
//       const currentSlot = slot.slots.find(s => 
//         parseInt(s.startTime.split(':')[0]) === hour
//       );
      
//       if (!currentSlot || currentSlot.status !== 'available') {
//         allSlotsAvailable = false;
//         unavailableSlot = currentSlot ? `${currentSlot.startTime}-${currentSlot.endTime}` : `${hour}:00-${hour+1}:00`;
//         break;
//       }
//     }
    
//     if (!allSlotsAvailable) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Not all slots between the selected times are available. Unavailable slot: ${unavailableSlot}` 
//       });
//     }
    
//     // Calculate booking price based on rate type
//     let price = 0;
//     if (rateType === 'hourly') {
//       // Calculate hours between from and to
//       const hours = toHour - fromHour;
//       price = slot.hourlyPrice * hours;
//     } else {
//       price = slot.dailyPrice;
//     }
    
//     // Calculate costs for additional selections
//     let additionalSelectionsTotal = 0;
    
//     // Here you would add code to calculate the cost of selected packages, services, equipment, helpers
//     // This would involve fetching those items and summing their costs
//     // For simplicity, we're skipping this calculation in this example
    
//     // Calculate additional costs total
//     const additionalCostsTotal = additionalCosts ? 
//       additionalCosts.reduce((total, item) => total + item.amount, 0) : 0;
    
//     // Calculate subtotal
//     const subtotal = price + additionalSelectionsTotal + additionalCostsTotal;
    
//     // Default tax percentage (can be configurable)
//     const taxPercentage = 18; // 18% GST
    
//     // Calculate tax amount
//     const taxAmount = (subtotal * taxPercentage) / 100;
    
//     // Calculate total amount (no discount in this simplified example)
//     const totalAmount = subtotal + taxAmount;
    
//     // Calculate balance amount after advance payment
//     const advanceAmountValue = advanceAmount || 0;
//     const balanceAmount = totalAmount - advanceAmountValue;
    
//     // Get the booking date from the slot document
//     const bookingDate = slot.date;
    
//     // Create booking object
//     const newBooking = new Booking({
//       bookingType,
//       ...(bookingType === 'studio' ? { studioId } : { freelancerId }),
//       userId,
//       slotId,
//       fromSlotId,
//       toSlotId,
//       bookingDate,
//       rateType,
//       price,
//       selectedPackages: selectedPackages || [],
//       selectedServices: selectedServices || [],
//       selectedEquipments: selectedEquipments || [],
//       selectedHelpers: selectedHelpers || [],
//       additionalCosts: additionalCosts || [],
//       subtotal,
//       taxPercentage,
//       taxAmount,
//       discountAmount: 0, // No discount in this simplified example
//       totalAmount,
//       advanceAmount: advanceAmountValue,
//       balanceAmount,
//       specialRequests,
//       status: advanceAmountValue > 0 ? 'confirmed' : 'pending'
//     });
    
//     // Add transaction if advance payment is made
//     if (advanceAmountValue > 0 && paymentMethod) {
//       newBooking.transactions.push({
//         amount: advanceAmountValue,
//         paymentMethod,
//         status: 'success', // Assuming payment is successful for simplicity
//         paymentDate: new Date()
//       });
      
//       newBooking.paymentStatus = advanceAmountValue >= totalAmount ? 'paid' : 'partially_paid';
//     }
    
//     // Save the booking
//     await newBooking.save({ session });
    
//     // Update the status of all slots between from and to
//     for (let hour = fromHour; hour < toHour; hour++) {
//       const slotIndex = slot.slots.findIndex(s => 
//         parseInt(s.startTime.split(':')[0]) === hour
//       );
      
//       if (slotIndex !== -1) {
//         slot.slots[slotIndex].status = 'booked';
//         slot.slots[slotIndex].bookedBy = userId;
//       }
//     }
    
//     // Save the updated slot document
//     await slot.save({ session });
    
//     // Commit the transaction
//     await session.commitTransaction();
    
//     // Return success response
//     return res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       data: newBooking
//     });
    
//   } catch (error) {
//     // Abort the transaction in case of error
//     await session.abortTransaction();
    
//     console.error('Error creating booking:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error creating booking',
//       error: error.message
//     });
//   } finally {
//     // End the session
//     session.endSession();
//   }
// };

// // Update booking status
// export const updateBookingStatus = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const { bookingId } = req.params;
//     const { status, adminNotes } = req.body;
    
//     if (!['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status value'
//       });
//     }
    
//     const booking = await Booking.findById(bookingId);
    
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }
    
//     // Check authorization based on the status update type
//     const isAdmin = req.user.isAdmin;
//     const isServiceProvider = 
//       (booking.bookingType === 'studio' && 
//        await Studio.exists({ 
//          _id: booking.studioId, 
//          'owner.userId': req.user._id 
//        })) ||
//       (booking.bookingType === 'freelancer' && 
//        await Freelancer.exists({ 
//          _id: booking.freelancerId, 
//          user: req.user._id 
//        }));
    
//     // Only admin, service provider, or user (for cancellation) can update status
//     if (!isAdmin && !isServiceProvider && 
//         !(status === 'cancelled' && booking.userId.toString() === req.user._id.toString())) {
//       return res.status(403).json({
//         success: false,
//         message: 'You are not authorized to update this booking status'
//       });
//     }
    
//     // If cancelling, handle slot release and potential refund logic
//     if (status === 'cancelled') {
//       // Update slot status back to available
//       const slot = await Slot.findById(booking.slotId);
//       if (slot) {
//         // Get the from and to slots
//         const fromSlot = slot.slots.id(booking.fromSlotId);
//         const toSlot = slot.slots.id(booking.toSlotId);
        
//         if (fromSlot && toSlot) {
//           const fromHour = parseInt(fromSlot.startTime.split(':')[0]);
//           const toHour = parseInt(toSlot.startTime.split(':')[0]);
          
//           // Reset status for all booked slots between from and to
//           for (let hour = fromHour; hour < toHour; hour++) {
//             const slotIndex = slot.slots.findIndex(s => 
//               parseInt(s.startTime.split(':')[0]) === hour
//             );
            
//             if (slotIndex !== -1) {
//               slot.slots[slotIndex].status = 'available';
//               slot.slots[slotIndex].bookedBy = undefined;
//             }
//           }
          
//           await slot.save({ session });
//         }
//       }
      
//       // Set cancellation details
//       booking.cancellation = {
//         cancelledAt: new Date(),
//         reason: req.body.reason || 'No reason provided',
//         refundAmount: req.body.refundAmount || 0,
//         refundStatus: req.body.refundAmount > 0 ? 'pending' : 'not_applicable'
//       };
      
//       // Update payment status if refund is to be processed
//       if (req.body.refundAmount > 0) {
//         booking.paymentStatus = 'refunded';
//       }
//     }
    
//     // Update booking status
//     booking.status = status;
    
//     // Add admin notes if provided
//     if (adminNotes) {
//       booking.adminNotes = adminNotes;
//     }
    
//     booking.updatedAt = new Date();
    
//     await booking.save({ session });
    
//     // Commit the transaction
//     await session.commitTransaction();
    
//     return res.status(200).json({
//       success: true,
//       message: `Booking status updated to ${status}`,
//       data: booking
//     });
    
//   } catch (error) {
//     // Abort the transaction in case of error
//     await session.abortTransaction();
    
//     console.error('Error updating booking status:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error updating booking status',
//       error: error.message
//     });
//   } finally {
//     // End the session
//     session.endSession();
//   }
// };

// // The rest of the controller methods would be updated similarly to work with fromSlotId and toSlotId


// controllers/bookingController.js
import Booking from "../../models/user/booking.model.js";
import Studio from "../../models/partner/Studio.model.js";
import Freelancer from "../../models/partner/freelancer.model.js";

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id; // From protect middleware
    
    // First, fetch the bookings without populating
    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 });
    
    // Then manually populate each booking based on entityType
    const populatedBookings = await Promise.all(bookings.map(async (booking) => {
      const bookingObj = booking.toObject();
      
      if (booking.entityType === 'studio') {
        // Populate with studio details
        const studio = await Studio.findById(booking.entityId)
          .populate({
            path: "owner",
            select: "name email mobileNumber gender dateOfBirth"
          });
          
        if (studio) {
          bookingObj.entityDetails = {
            name: studio.studioName,
            image: studio.studioLogo,
            location: studio.address ? `${studio.address.city}, ${studio.address.state}` : "Location unavailable",
            address: studio.address,
            description: studio.studioDescription,
            email: studio.studioEmail,
            mobileNumber: studio.studioMobileNumber,
            owner: studio.owner
          };
        }
      } else if (booking.entityType === 'freelancer') {
        // Populate with freelancer details
        const freelancer = await Freelancer.findById(booking.entityId);
        
        if (freelancer) {
          bookingObj.entityDetails = {
            name: freelancer.name,
            image: freelancer.profileImage,
            location: freelancer.location,
            description: freelancer.description,
            categories: freelancer.categories,
            experience: freelancer.experience,
            pricePerHour: freelancer.pricePerHour
          };
        }
      }
      
      return bookingObj;
    }));
    
    return res.status(200).json({
      success: true,
      data: populatedBookings
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id; // From protect middleware
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    
    // Verify the booking belongs to the user
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this booking"
      });
    }
    
    // Convert to plain object
    const bookingObj = booking.toObject();
    
    // Populate entity details based on type
    if (booking.entityType === 'studio') {
      const studio = await Studio.findById(booking.entityId)
        .populate({
          path: "owner",
          select: "name email mobileNumber gender dateOfBirth"
        });
        
      if (studio) {
        bookingObj.entityDetails = {
          name: studio.studioName,
          image: studio.studioLogo,
          location: studio.address ? `${studio.address.city}, ${studio.address.state}` : "Location unavailable",
          address: studio.address,
          description: studio.studioDescription,
          email: studio.studioEmail,
          mobileNumber: studio.studioMobileNumber,
          owner: studio.owner
        };
      }
    } else if (booking.entityType === 'freelancer') {
      const freelancer = await Freelancer.findById(booking.entityId);
      
      if (freelancer) {
        bookingObj.entityDetails = {
          name: freelancer.name,
          image: freelancer.profileImage,
          location: freelancer.location,
          description: freelancer.description,
          categories: freelancer.categories,
          experience: freelancer.experience,
          pricePerHour: freelancer.pricePerHour
        };
      }
    }
    
    return res.status(200).json({
      success: true,
      data: bookingObj
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};