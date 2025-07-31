// availability.controller.js
import Availability from '../../models/partner/availability.model.js';
import moment from 'moment';
import { getEntityId } from '../../utils/roleUtils.js';

// Get all availability data for a partner (date range)
// export const getPartnerAvailability = async (req, res) => {
//   try {
//     const partnerId = req.user._id; // From auth middleware
//     const { startDate, endDate } = req.query;

//     const query =  {partnerId} 
    
//     // Add date range if provided
//     if (startDate && endDate) {
//       query.date = {
//         $gte: moment(startDate).startOf('day').toDate(),
//         $lte: moment(endDate).endOf('day').toDate()
//       };
//     }
    
//     const availabilityData = await Availability.find(query).sort({ date: 1 });

    
    
//     // Format the response for the frontend
//     const formattedData = {};
//     availabilityData.forEach(item => {
//       const dateKey = moment(item.date).format('YYYY-MM-DD');
      
//       // Get unavailable slots
//       const unavailableSlots = item.timeSlots
//         .filter(slot => !slot.isAvailable)
//         .map(slot => slot.startTime);

        
      
//       // Get available slots
//       const availableSlots = item.timeSlots
//         .filter(slot => slot.isAvailable)
//         .map(slot => slot.startTime);
      
       
        

//       formattedData[dateKey] = {
//         unavailableSlots,
//         availableSlots,
//         isFullyBooked: item.isFullyBooked
//       };
//     });
    
//     res.status(200).json({
//       success: true,
//       data: formattedData
//     });
//   } catch (error) {
//     console.error('Error getting availability:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get availability data',
//       error: error.message
//     });
//   }
// };


// export const getPartnerAvailability = async (req, res) => { 
//   try {
//     const { startDate, endDate } = req.query;

//     // Get the correct entityId and entityType from the utility function
//     const { entityId, entityType } = await getEntityId(req);

//     // Dynamically assign the field name (studioId or freelancerId) using template literals
//     const entityField = `${entityType}Id`;

//     // Build the query object dynamically
//     const query = { [entityField]: entityId };

//     // Add date range if provided
//     if (startDate && endDate) {
//       query.date = {
//         $gte: moment(startDate).startOf('day').toDate(),
//         $lte: moment(endDate).endOf('day').toDate()
//       };
//     }

//     // Fetch availability data based on the dynamic query
//     const availabilityData = await Availability.find(query).sort({ date: 1 });

//     // Format the response for the frontend
//     const formattedData = {};
//     availabilityData.forEach(item => {
//       const dateKey = moment(item.date).format('YYYY-MM-DD');

//       // Get unavailable slots
//       const unavailableSlots = item.timeSlots
//         .filter(slot => !slot.isAvailable)
//         .map(slot => slot.startTime);

//       // Get available slots
//       const availableSlots = item.timeSlots
//         .filter(slot => slot.isAvailable)
//         .map(slot => slot.startTime);

//       formattedData[dateKey] = {
//         unavailableSlots,
//         availableSlots,
//         isFullyBooked: item.isFullyBooked
//       };
//     });

//     res.status(200).json({
//       success: true,
//       data: formattedData
//     });
//   } catch (error) {
//     console.error('Error getting availability:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get availability data',
//       error: error.message
//     });
//   }
// };

// Updated availability.controller.js - getPartnerAvailability function
export const getPartnerAvailability = async (req, res) => { 
  try {
    const { startDate, endDate } = req.query;

    // Get the correct entityId and entityType from the utility function
    const { entityId, entityType } = await getEntityId(req);

    // Dynamically assign the field name (studioId or freelancerId) using template literals
    const entityField = `${entityType}Id`;

    // Build the query object dynamically
    const query = { [entityField]: entityId };

    // Add date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      };
    }

    // Fetch availability data based on the dynamic query
    const availabilityData = await Availability.find(query).sort({ date: 1 });

    // Format the response for the frontend
    const formattedData = {};
    availabilityData.forEach(item => {
      const dateKey = moment(item.date).format('YYYY-MM-DD');

      // Get unavailable slots
      const unavailableSlots = item.timeSlots
        .filter(slot => !slot.isAvailable)
        .map(slot => slot.startTime);

      // Get available slots
      const availableSlots = item.timeSlots
        .filter(slot => slot.isAvailable)
        .map(slot => slot.startTime);

      // Concise logging
      console.log(`[${dateKey}] Unavailable: ${unavailableSlots.length}/12, FullyBooked: ${item.isFullyBooked}`);

      formattedData[dateKey] = {
        unavailableSlots,
        availableSlots,
        isFullyBooked: item.isFullyBooked
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error getting availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get availability data',
      error: error.message
    });
  }
};

// Updated getAvailabilityByDate function - FIX THE DATE QUERY ISSUE
export const getAvailabilityByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Try multiple date formats to find the document
    const dateFormats = [
      moment(date).startOf('day').toDate(),
      moment(date).endOf('day').toDate(),
      moment(date).toDate(),
      // Also try the exact format from your DB (with time)
      moment(`${date}T18:29:59.999Z`).toDate()
    ];

    // Get the correct entityId and entityType from the utility function
    const { entityId, entityType } = await getEntityId(req);

    // Dynamically assign the field name (studioId or freelancerId) using template literals
    const entityField = `${entityType}Id`;

    console.log(`[Individual Query] Looking for ${entityField}: ${entityId} on ${date}`);

    // Try to find the document with date range query
    const availability = await Availability.findOne({
      [entityField]: entityId,
      date: {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate()
      }
    });

    if (!availability) {
      console.log(`[Individual Query] No availability found for ${date}`);
      // If no document exists, return default (all available)
      return res.status(200).json({
        success: true,
        data: {
          unavailableSlots: [],
          availableSlots: Array.from({ length: 12 }, (_, i) => {
            const hour = i + 8;
            return `${hour < 10 ? '0' + hour : hour}:00`;
          }),
          isFullyBooked: false,
        },
      });
    }

    console.log(`[Individual Query] Found availability for ${date}:`, {
      actualDate: availability.date,
      timeSlots: availability.timeSlots.length,
      isFullyBooked: availability.isFullyBooked
    });

    // Format the response
    const unavailableSlots = availability.timeSlots
      .filter(slot => !slot.isAvailable)
      .map(slot => slot.startTime);

    const availableSlots = availability.timeSlots
      .filter(slot => slot.isAvailable)
      .map(slot => slot.startTime);

    // Debug: Log each time slot
    console.log(`[${date}] Individual query - Found ${availability.timeSlots.length} slots`);
    console.log(`[${date}] Unavailable: ${unavailableSlots.length}/12, Available: ${availableSlots.length}/12`);

    res.status(200).json({
      success: true,
      data: {
        [entityField]: entityId,
        date: availability.date,
        unavailableSlots,
        availableSlots,
        isFullyBooked: availability.isFullyBooked
      },
    });
  } catch (error) {
    console.error('Error getting date availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get availability for the selected date',
      error: error.message,
    });
  }
};

// Get availability for a specific date
// export const getAvailabilityByDate = async (req, res) => {
//   try {
//     const partnerId = req.user._id;
//     const { date } = req.params;
    
//     const formattedDate = moment(date).startOf('day').toDate();
    
//     const availability = await Availability.findOne({
//       partnerId,
//       date: formattedDate
//     });
    
//     if (!availability) {
//       // If no document exists, return default (all available)
//       return res.status(200).json({
//         success: true,
//         data: {
//           unavailableSlots: [],
//           availableSlots: Array.from({ length: 12 }, (_, i) => {
//             const hour = i + 8;
//             return `${hour < 10 ? '0' + hour : hour}:00`;
//           }),
//           isFullyBooked: false
//         }
//       });
//     }
    
//     // Format the response
//     const unavailableSlots = availability.timeSlots
//       .filter(slot => !slot.isAvailable)
//       .map(slot => slot.startTime);
    
//     const availableSlots = availability.timeSlots
//       .filter(slot => slot.isAvailable)
//       .map(slot => slot.startTime);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         unavailableSlots,
//         availableSlots,
//         isFullyBooked: availability.isFullyBooked
//       }
//     });
//   } catch (error) {
//     console.error('Error getting date availability:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get availability for the selected date',
//       error: error.message
//     });
//   }
// };

// export const getAvailabilityByDate = async (req, res) => {
//   try {
//     const { date } = req.params;

//     const formattedDate = moment(date).startOf('day').toDate();

//     // Get the correct entityId and entityType from the utility function
//     const { entityId, entityType } = await getEntityId(req);

//     // Dynamically assign the field name (studioId or freelancerId) using template literals
//     const entityField = `${entityType}Id`;

//     // Find availability for the given entity and date
//     const availability = await Availability.findOne({
//       [entityField]: entityId,
//       date: formattedDate,
//     });

//     if (!availability) {
//       // If no document exists, return default (all available)
//       return res.status(200).json({
//         success: true,
//         data: {
//           unavailableSlots: [],
//           availableSlots: Array.from({ length: 12 }, (_, i) => {
//             const hour = i + 8;
//             return `${hour < 10 ? '0' + hour : hour}:00`;
//           }),
//           isFullyBooked: false,
//         },
//       });
//     }

//     // Format the response
//     const unavailableSlots = availability.timeSlots
//       .filter(slot => !slot.isAvailable)
//       .map(slot => slot.startTime);

//     const availableSlots = availability.timeSlots
//       .filter(slot => slot.isAvailable)
//       .map(slot => slot.startTime);

//     res.status(200).json({
//       success: true,
//       data: {
//         [entityField]: entityId,
//         date: formattedDate,
//         unavailableSlots,
//         availableSlots,
//         isFullyBooked: availability.isFullyBooked,
//       },
//     });
//   } catch (error) {
//     console.error('Error getting date availability:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get availability for the selected date',
//       error: error.message,
//     });
//   }
// };



// Set availability (create new or replace)
// export const setAvailability = async (req, res) => {
//   try {
//     const { date, unavailableSlots } = req.body;
//     const partnerId = req.user._id;
    
//     const formattedDate = moment(date).startOf('day').toDate();
    
//     // Generate all possible time slots
//     const allTimeSlots = Array.from({ length: 12 }, (_, i) => {
//       const hour = i + 8; // Starting from 8 AM
//       const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
//       const endTime = `${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;
      
//       return {
//         startTime,
//         endTime,
//         isAvailable: !unavailableSlots.includes(startTime)
//       };
//     });
    
//     // Check if partner has fully blocked the day
//     const isFullyBooked = unavailableSlots.length === 12; // Assuming 12 time slots
    
//     // Find and update or create new availability document
//     const result = await Availability.findOneAndUpdate(
//       { partnerId, date: formattedDate },
//       { 
//         partnerId,
//         date: formattedDate,
//         timeSlots: allTimeSlots,
//         isFullyBooked
//       },
//       { new: true, upsert: true }
//     );
    
//     // Format response
//     const availableSlots = result.timeSlots
//       .filter(slot => slot.isAvailable)
//       .map(slot => slot.startTime);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         date: formattedDate,
//         unavailableSlots,
//         availableSlots,
//         isFullyBooked
//       }
//     });
//   } catch (error) {
//     console.error('Error setting availability:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to set availability',
//       error: error.message
//     });
//   }


export const setAvailability = async (req, res) => { 
  try {
    const { date, unavailableSlots } = req.body;
    
    const formattedDate = moment(date).startOf('day').toDate();
    
    // Get the correct entityId and entityType from the utility function
    const { entityId, entityType } = await getEntityId(req);

    // Generate all possible time slots
    const allTimeSlots = Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8; // Starting from 8 AM
      const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
      const endTime = `${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;

      return {
        startTime,
        endTime,
        isAvailable: !unavailableSlots.includes(startTime)
      };
    });
    
    // Check if the partner has fully blocked the day
    const isFullyBooked = unavailableSlots.length === 12; // Assuming 12 time slots
    
    // Dynamically assign the field name (studioId or freelancerId) based on entityType using template literals
    const entityField = `${entityType}Id`;  // This will create either 'studioId' or 'freelancerId'

    // Find and update or create new availability document
    const result = await Availability.findOneAndUpdate(
      { 
        date: formattedDate,
        [entityField]: entityId  // Use the dynamic field name (studioId or freelancerId)
      },
      { 
        date: formattedDate,
        timeSlots: allTimeSlots,
        isFullyBooked,
        [entityField]: entityId  // Add the dynamic field name (studioId or freelancerId)
      },
      { new: true, upsert: true }
    );
    
    // Format response
    const availableSlots = result.timeSlots
      .filter(slot => slot.isAvailable)
      .map(slot => slot.startTime);
    
    res.status(200).json({
      success: true,
      data: {
        date: formattedDate,
        unavailableSlots,
        availableSlots,
        isFullyBooked
      }
    });
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set availability',
      error: error.message
    });
  }
};
// };



// Update availability for a specific date (partial update)
// export const updateAvailability = async (req, res) => {
//   try {
//     const { date } = req.params;
//     const { unavailableSlots } = req.body;
//     const partnerId = req.user._id;

    
    
//     const formattedDate = moment(date).startOf('day').toDate();
    
//     // Find existing document
//     const existingAvailability = await Availability.findOne({
//       partnerId,
//       date: formattedDate
//     });
    
//     // Generate all time slots
//     const allTimeSlots = Array.from({ length: 12 }, (_, i) => {
//       const hour = i + 8;
//       const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
//       const endTime = `${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;
      
//       // Check if slot is unavailable
//       const isUnavailable = unavailableSlots.includes(startTime);
      
//       return {
//         startTime,
//         endTime,
//         isAvailable: !isUnavailable
//       };
//     });
    
//     const isFullyBooked = unavailableSlots.length === 12;
    
//     let result;
    
//     if (existingAvailability) {
//       // Update existing document
//       result = await Availability.findOneAndUpdate(
//         { partnerId, date: formattedDate },
//         { 
//           timeSlots: allTimeSlots,
//           isFullyBooked
//         },
//         { new: true }
//       );
//     } else {
//       // Create new document
//       result = await Availability.create({
//         partnerId,
//         date: formattedDate,
//         timeSlots: allTimeSlots,
//         isFullyBooked
//       });
//     }
    
//     // Format response
//     const availableSlots = result.timeSlots
//       .filter(slot => slot.isAvailable)
//       .map(slot => slot.startTime);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         date: formattedDate,
//         unavailableSlots,
//         availableSlots,
//         isFullyBooked
//       }
//     });
//   } catch (error) {
//     console.error('Error updating availability:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update availability',
//       error: error.message
//     });
//   }
// };


export const updateAvailability = async (req, res) => {
  try {
    const { date } = req.params;
    const { unavailableSlots } = req.body;

    console.log(req.body,date,"xxxxxxxxxxxx");
    
    
    const formattedDate = moment(date).startOf('day').toDate();
    
    // Get the correct entityId and entityType from the utility function
    const { entityId, entityType } = await getEntityId(req);

    // Generate all time slots
    const allTimeSlots = Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8;
      const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
      const endTime = `${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;
      
      // Check if slot is unavailable
      const isUnavailable = unavailableSlots.includes(startTime);
      
      return {
        startTime,
        endTime,
        isAvailable: !isUnavailable
      };
    });
    
    const isFullyBooked = unavailableSlots.length === 12;

    // Dynamically assign the field name (studioId or freelancerId) based on entityType using template literals
    const entityField = `${entityType}Id`;  // This will create either 'studioId' or 'freelancerId'

    // Find existing document
    const existingAvailability = await Availability.findOne({
      [entityField]: entityId,
      date: formattedDate
    });

    let result;

    if (existingAvailability) {
      // Update existing document
      result = await Availability.findOneAndUpdate(
        { [entityField]: entityId, date: formattedDate },
        { 
          timeSlots: allTimeSlots,
          isFullyBooked
        },
        { new: true }
      );
    } else {
      // Create new document
      result = await Availability.create({
        [entityField]: entityId,
        date: formattedDate,
        timeSlots: allTimeSlots,
        isFullyBooked
      });
    }
    
    // Format response
    const availableSlots = result.timeSlots
      .filter(slot => slot.isAvailable)
      .map(slot => slot.startTime);
    
    res.status(200).json({
      success: true,
      data: {
        date: formattedDate,
        unavailableSlots,
        availableSlots,
        isFullyBooked
      }
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: error.message
    });
  }
};


// Get available slots for users
// export const getAvailableSlots = async (req, res) => {
//   try {
//     const partnerId = req.user._id; // ✅ Authenticated user
//     const { date } = req.query;     // ✅ Get from query

//     const formattedDate = moment(date).startOf('day').toDate(); // ✅ Normalize to start of day

//     const availability = await Availability.findOne({
//       partnerId,
//       date: formattedDate,
//     });

//     if (!availability) {
//       // No availability found, return default slots
//       const defaultSlots = Array.from({ length: 12 }, (_, i) => {
//         const hour = i + 8; // 8AM to 8PM
//         const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
//         const endTime = `${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;

//         return {
//           startTime,
//           endTime,
//           isAvailable: true,
//         };
//       });

//       return res.status(200).json({
//         success: true,
//         data: {
//           partnerId,
//           date: formattedDate,
//           availableSlots: defaultSlots,
//           isFullyBooked: false,
//         },
//       });
//     }


//   } catch (error) {
//     console.error('Error getting availability:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get availability',
//       error: error.message,
//     });
//   }
// };


export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;  // Get date from query

    const formattedDate = moment(date).startOf('day').toDate(); // Normalize to start of day

    // Get the correct entityId and entityType from the utility function
    const { entityId, entityType } = await getEntityId(req);

    // Dynamically assign the field name (studioId or freelancerId) using template literals
    const entityField = `${entityType}Id`;

    // Find availability for the given entity and date
    const availability = await Availability.findOne({
      [entityField]: entityId,
      date: formattedDate,
    });

    if (!availability) {
      // No availability found, return default slots
      const defaultSlots = Array.from({ length: 12 }, (_, i) => {
        const hour = i + 8; // 8AM to 8PM
        const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
        const endTime = `${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;

        return {
          startTime,
          endTime,
          isAvailable: true,
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          [entityField]: entityId,
          date: formattedDate,
          availableSlots: defaultSlots,
          isFullyBooked: false,
        },
      });
    }

    // Get available slots from existing availability
    const availableSlots = availability.timeSlots
      .filter(slot => slot.isAvailable)
      .map(slot => slot.startTime);

    return res.status(200).json({
      success: true,
      data: {
        [entityField]: entityId,
        date: formattedDate,
        availableSlots,
        isFullyBooked: availability.isFullyBooked,
      },
    });
  } catch (error) {
    console.error('Error getting availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get availability',
      error: error.message,
    });
  }
};
