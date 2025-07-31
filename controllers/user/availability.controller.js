import mongoose from "mongoose";
import availabilityModel from "../../models/partner/availability.model.js";
import Studio from "../../models/partner/studio.model.js";
import moment from 'moment';
import FreelancerModel from "../../models/partner/freelancer.model.js";

const getAvailability = async (req, res) => {
  try {

    const { entityType, entityId } = req.params;
    const { date } = req.query;

    if (!entityId || !mongoose.Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({ success: false, message: 'Valid entity ID is required' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    const parsedDate = moment(date, 'YYYY-MM-DD', true);
    if (!parsedDate.isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    if (entityType === 'studio') {
      const studio = await Studio.findById(entityId);
      if (!studio) {
        return res.status(404).json({ success: false, message: 'Studio not found' });
      }
    } else if (entityType === 'freelancer') {
      const freelancer = await FreelancerModel.findById(entityId);
      if (!freelancer) {
        return res.status(404).json({ success: false, message: 'freelancer not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid entity type' });
    }



    const startOfDay = parsedDate.startOf('day').toDate();
    const endOfDay = parsedDate.endOf('day').toDate();

    const entityField = `${entityType}Id`;

    let availability = await availabilityModel.findOne({
      [entityField]: entityId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!availability) {
      // Create and save default availability in DB
      availability = new availabilityModel({
        [entityField]: entityId,
        // date: parsedDate.toDate(),
        date: parsedDate.startOf('day').toDate(),
        isFullyBooked: false,
        timeSlots: generateDefaultTimeSlots()
      });

      await availability.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Availability retrieved successfully',
      data: availability
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAvailabilityRange = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { startDate, endDate } = req.query;
    

    if (!entityId || !mongoose.Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({ success: false, message: 'Valid entity ID is required' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start and end date are required' });
    }

    const parsedStartDate = moment(startDate, 'YYYY-MM-DD', true);
    const parsedEndDate = moment(endDate, 'YYYY-MM-DD', true);

    if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const dayDiff = parsedEndDate.diff(parsedStartDate, 'days');
    if (dayDiff < 0) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }
    if (dayDiff > 31) {
      return res.status(400).json({ success: false, message: 'Date range cannot exceed 31 days' });
    }

    if (entityType === 'studio') {
      const studio = await Studio.findById(entityId);
      if (!studio) {
        return res.status(404).json({ success: false, message: 'Studio not found' });
      }
    } else if (entityType === 'freelancer') {
      const freelancer = await FreelancerModel.findById(entityId);
      if (!freelancer) {
        return res.status(404).json({ success: false, message: 'freelancer not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid entity type' });
    }

    
    const rangeStart = parsedStartDate.startOf('day').toDate();
    const rangeEnd = parsedEndDate.endOf('day').toDate();

    const entityField = `${entityType}Id`;

    const availabilityRecords = await availabilityModel.find({
      [entityField]: entityId,
      date: { $gte: rangeStart, $lte: rangeEnd }
    }).sort({ date: 1 });

    const response = generateCompleteRangeResponse(parsedStartDate, parsedEndDate, availabilityRecords);

    

    return res.status(200).json({
      success: true,
      message: 'Availability range retrieved successfully',
      data: response
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const { date, slotIds } = req.body;

    if (!entityId || !mongoose.Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({ success: false, message: 'Valid entity ID is required' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    if (!Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one time slot ID is required' });
    }

    if (entityType === 'studio') {
      const studio = await Studio.findById(entityId);
      if (!studio) {
        return res.status(404).json({ success: false, message: 'Studio not found' });
      }
    } else if (entityType === 'freelancer') {
      const freelancer = await FreelancerModel.findById(entityId);
      if (!freelancer) {
        return res.status(404).json({ success: false, message: 'freelancer not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid entity type' });
    }

    const parsedDate = moment(date, 'YYYY-MM-DD', true);
    if (!parsedDate.isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const startOfDay = parsedDate.startOf('day').toDate();
    const endOfDay = parsedDate.endOf('day').toDate();

    const entityField = `${entityType}Id`;

    const availability = await availabilityModel.findOne({
      [entityField]: entityId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const requestedSlotIds = slotIds.map(id =>
      mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
    );

    if (!availability) {
      return res.status(200).json({
        success: true,
        message: 'All requested time slots are available',
        isAvailable: true
      });
    }

    const unavailableSlots = availability.timeSlots.filter(slot =>
      requestedSlotIds.some(id => slot._id.equals(id)) && !slot.isAvailable
    );

    const isAvailable = unavailableSlots.length === 0;

    return res.status(200).json({
      success: true,
      message: isAvailable ? 'All requested time slots are available' : 'Some requested time slots are not available',
      isAvailable,
      unavailableSlots: isAvailable ? [] : unavailableSlots
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Helper functions
const generateCompleteRangeResponse = (startDate, endDate, availabilityRecords) => {
  const response = [];
  const recordsMap = new Map();

  availabilityRecords.forEach(record => {
    const dateStr = moment(record.date).format('YYYY-MM-DD');
    recordsMap.set(dateStr, record);
  });

  let currentDate = moment(startDate);
  while (currentDate.isSameOrBefore(endDate)) {
    const dateStr = currentDate.format('YYYY-MM-DD');
    if (recordsMap.has(dateStr)) {
      response.push(recordsMap.get(dateStr));
    } else {
      response.push({
        // date: currentDate.toDate(),
        date: currentDate.startOf('day').toDate(),
        isFullyBooked: false,
        timeSlots: generateDefaultTimeSlots(),
        isGenerated: true
      });
    }
    currentDate.add(1, 'days');
  }

  return response;
};

const generateDefaultTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    const startHour = hour.toString().padStart(2, '0');
    const endHour = (hour + 1).toString().padStart(2, '0');
    slots.push({
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`,
      isAvailable: true,
      _id: new mongoose.Types.ObjectId()
    });
  }
  return slots;
};

export {
  getAvailability,
  getAvailabilityRange,
  checkAvailability
};
// import mongoose from "mongoose";
// import availabilityModel from "../../models/partner/availability.model.js";
// import Studio from "../../models/partner/studio.model.js";
// import moment from 'moment';

// // const getStudioAvailability = async (req, res) => {
// //   try {
// //     const { studioId } = req.params;
// //     const { date } = req.query;

// //     if (!studioId || !mongoose.Types.ObjectId.isValid(studioId)) {
// //       return res.status(400).json({ success: false, message: 'Valid studio ID is required' });
// //     }

// //     if (!date) {
// //       return res.status(400).json({ success: false, message: 'Date parameter is required' });
// //     }

// //     const parsedDate = moment(date, 'YYYY-MM-DD', true);
// //     if (!parsedDate.isValid()) {
// //       return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
// //     }

// //     const studio = await Studio.findById(studioId);
// //     if (!studio) {
// //       return res.status(404).json({ success: false, message: 'Studio not found' });
// //     }

// //     const startOfDay = parsedDate.startOf('day').toDate();
// //     const endOfDay = parsedDate.endOf('day').toDate();

// //     let availability = await availabilityModel.findOne({
// //       partnerId: studio.owner.userId,
// //       date: { $gte: startOfDay, $lte: endOfDay }
// //     });

// //     if (!availability) {
// //       availability = {
// //         date: parsedDate.toDate(),
// //         isFullyBooked: false,
// //         timeSlots: generateDefaultTimeSlots()
// //       };
// //     }

    

// //     return res.status(200).json({
// //       success: true,
// //       message: 'Studio availability retrieved successfully',
// //       data: availability
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// const getStudioAvailability = async (req, res) => {
//   try {
//     const { studioId } = req.params;
//     const { date } = req.query;

//     if (!studioId || !mongoose.Types.ObjectId.isValid(studioId)) {
//       return res.status(400).json({ success: false, message: 'Valid studio ID is required' });
//     }

//     if (!date) {
//       return res.status(400).json({ success: false, message: 'Date parameter is required' });
//     }

//     const parsedDate = moment(date, 'YYYY-MM-DD', true);
//     if (!parsedDate.isValid()) {
//       return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
//     }

//     const studio = await Studio.findById(studioId);
//     if (!studio) {
//       return res.status(404).json({ success: false, message: 'Studio not found' });
//     }

//     const startOfDay = parsedDate.startOf('day').toDate();
//     const endOfDay = parsedDate.endOf('day').toDate();

//     let availability = await availabilityModel.findOne({
//       partnerId: studio.owner.userId,
//       date: { $gte: startOfDay, $lte: endOfDay }
//     });

//     if (!availability) {
//       // Create and save default availability in DB
//       availability = new availabilityModel({
//         partnerId: studio.owner.userId,
//         date: parsedDate.toDate(),
//         isFullyBooked: false,
//         timeSlots: generateDefaultTimeSlots()
//       });

//       await availability.save();
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Studio availability retrieved successfully',
//       data: availability
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getStudioAvailabilityRange = async (req, res) => {
//   try {
//     const { studioId } = req.params;
//     const { startDate, endDate } = req.query;
    

//     if (!studioId || !mongoose.Types.ObjectId.isValid(studioId)) {
//       return res.status(400).json({ success: false, message: 'Valid studio ID is required' });
//     }

//     if (!startDate || !endDate) {
//       return res.status(400).json({ success: false, message: 'Start and end date are required' });
//     }

//     const parsedStartDate = moment(startDate, 'YYYY-MM-DD', true);
//     const parsedEndDate = moment(endDate, 'YYYY-MM-DD', true);

//     if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
//       return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
//     }

//     const dayDiff = parsedEndDate.diff(parsedStartDate, 'days');
//     if (dayDiff < 0) {
//       return res.status(400).json({ success: false, message: 'End date must be after start date' });
//     }
//     if (dayDiff > 31) {
//       return res.status(400).json({ success: false, message: 'Date range cannot exceed 31 days' });
//     }

//     const studio = await Studio.findById(studioId);
//     if (!studio) {
//       return res.status(404).json({ success: false, message: 'Studio not found' });
//     }

    
//     const rangeStart = parsedStartDate.startOf('day').toDate();
//     const rangeEnd = parsedEndDate.endOf('day').toDate();

//     const availabilityRecords = await availabilityModel.find({
//       partnerId: studio.owner.userId,
//       date: { $gte: rangeStart, $lte: rangeEnd }
//     }).sort({ date: 1 });

//     const response = generateCompleteRangeResponse(parsedStartDate, parsedEndDate, availabilityRecords);

    

//     return res.status(200).json({
//       success: true,
//       message: 'Studio availability range retrieved successfully',
//       data: response
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const checkStudioAvailability = async (req, res) => {
//   try {
//     const { studioId } = req.params;
//     const { date, slotIds } = req.body;

//     if (!studioId || !mongoose.Types.ObjectId.isValid(studioId)) {
//       return res.status(400).json({ success: false, message: 'Valid studio ID is required' });
//     }

//     if (!date) {
//       return res.status(400).json({ success: false, message: 'Date is required' });
//     }

//     if (!Array.isArray(slotIds) || slotIds.length === 0) {
//       return res.status(400).json({ success: false, message: 'At least one time slot ID is required' });
//     }

//     const studio = await Studio.findById(studioId);
//     if (!studio) {
//       return res.status(404).json({ success: false, message: 'Studio not found' });
//     }

//     const parsedDate = moment(date, 'YYYY-MM-DD', true);
//     if (!parsedDate.isValid()) {
//       return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
//     }

//     const startOfDay = parsedDate.startOf('day').toDate();
//     const endOfDay = parsedDate.endOf('day').toDate();

//     const availability = await availabilityModel.findOne({
//         partnerId: studio.owner.userId,
//       date: { $gte: startOfDay, $lte: endOfDay }
//     });

//     const requestedSlotIds = slotIds.map(id =>
//       mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
//     );

//     if (!availability) {
//       return res.status(200).json({
//         success: true,
//         message: 'All requested time slots are available',
//         isAvailable: true
//       });
//     }

//     const unavailableSlots = availability.timeSlots.filter(slot =>
//       requestedSlotIds.some(id => slot._id.equals(id)) && !slot.isAvailable
//     );

//     const isAvailable = unavailableSlots.length === 0;

//     return res.status(200).json({
//       success: true,
//       message: isAvailable ? 'All requested time slots are available' : 'Some requested time slots are not available',
//       isAvailable,
//       unavailableSlots: isAvailable ? [] : unavailableSlots
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Helper functions
// const generateCompleteRangeResponse = (startDate, endDate, availabilityRecords) => {
//   const response = [];
//   const recordsMap = new Map();

//   availabilityRecords.forEach(record => {
//     const dateStr = moment(record.date).format('YYYY-MM-DD');
//     recordsMap.set(dateStr, record);
//   });

//   let currentDate = moment(startDate);
//   while (currentDate.isSameOrBefore(endDate)) {
//     const dateStr = currentDate.format('YYYY-MM-DD');
//     if (recordsMap.has(dateStr)) {
//       response.push(recordsMap.get(dateStr));
//     } else {
//       response.push({
//         date: currentDate.toDate(),
//         isFullyBooked: false,
//         timeSlots: generateDefaultTimeSlots(),
//         isGenerated: true
//       });
//     }
//     currentDate.add(1, 'days');
//   }

//   return response;
// };

// const generateDefaultTimeSlots = () => {
//   const slots = [];
//   for (let hour = 8; hour < 20; hour++) {
//     const startHour = hour.toString().padStart(2, '0');
//     const endHour = (hour + 1).toString().padStart(2, '0');
//     slots.push({
//       startTime: `${startHour}:00`,
//       endTime: `${endHour}:00`,
//       isAvailable: true,
//       _id: new mongoose.Types.ObjectId()
//     });
//   }
//   return slots;
// };

// export {
//   getStudioAvailability,
//   getStudioAvailabilityRange,
//   checkStudioAvailability
// };
