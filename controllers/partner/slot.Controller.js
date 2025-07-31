import Slot from "../../models/partner/slot.model.js";

const createSlots = async (req, res) => {
    try {
      const {
        studioId,
        fromDate,
        toDate,
        bookingType,
        hourlyPrice,
        dailyPrice,
        slotTimings,
      } = req.body;
  
      if (!studioId || !fromDate || !toDate || !slotTimings || !bookingType) {
        return res
          .status(400)
          .json({
            message:
              "studioId, fromDate, toDate, bookingType, and slotTimings are required",
          });
      }
  
      if (bookingType === "hourly" && !hourlyPrice) {
        return res
          .status(400)
          .json({ message: "hourlyPrice is required for hourly bookingType" });
      }
  
      if (bookingType === "daily" && !dailyPrice) {
        return res
          .status(400)
          .json({ message: "dailyPrice is required for daily bookingType" });
      }
  
      if (bookingType === "both" && (!hourlyPrice || !dailyPrice)) {
        return res
          .status(400)
          .json({
            message:
              "Both hourlyPrice and dailyPrice are required for both bookingType",
          });
      }
  
      const start = new Date(fromDate);
      const end = new Date(toDate);
  
      if (start > end) {
        return res
          .status(400)
          .json({ message: "fromDate must be less than or equal to toDate" });
      }
  
      const existingSlots = await Slot.find({
        studioId,
        date: { $gte: start, $lte: end },
      });
  
      if (existingSlots.length > 0) {
        return res
          .status(400)
          .json({ message: "Slots already exist for the given date range" });
      }
  
      const slots = [];
  
      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const slotDate = new Date(date);
        const startTime = new Date(slotDate);
        startTime.setHours(
          parseInt(slotTimings.startTime.split(":")[0], 10) + 5,
          parseInt(slotTimings.startTime.split(":")[1], 10) + 30,
          0
        );
        const endTime = new Date(slotDate);
        endTime.setHours(
          parseInt(slotTimings.endTime.split(":")[0], 10) + 5,
          parseInt(slotTimings.endTime.split(":")[1], 10) + 30,
          0
        );
        const hourlySlots = [];
  
        for (
          let time = new Date(startTime);
          time < endTime;
          time.setHours(time.getHours() + 1)
        ) {
          const slotStartTime = new Date(time);
          const slotEndTime = new Date(time);
          slotEndTime.setHours(slotEndTime.getHours() + 1);
  
          hourlySlots.push({
            startTime: slotStartTime.toISOString(),
            endTime: slotEndTime.toISOString(),
            status: "available",
          });
        }
  
        const slot = new Slot({
          studioId,
          date: slotDate,
          rateType: bookingType,
          hourlyPrice:
            bookingType === "hourly" || bookingType === "both" ? hourlyPrice : "",
          dailyPrice:
            bookingType === "daily" || bookingType === "both" ? dailyPrice : "",
          slots: hourlySlots,
        });
        slots.push(slot);
      }
  
      await Slot.insertMany(slots);
  
      res.status(201).json({ message: "Slots created successfully", slots });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating slots", error });
    }
  };


  const editSlot = async (req, res) => {
    try {
      const { slotId, bookingType, hourlyPrice, dailyPrice, slotTimings } =
        req.body;
  
      if (!slotId || !slotTimings || !bookingType) {
        return res
          .status(400)
          .json({ message: "slotId, bookingType, and slotTimings are required" });
      }
  
      if (bookingType === "hourly" && !hourlyPrice) {
        return res
          .status(400)
          .json({ message: "hourlyPrice is required for hourly bookingType" });
      }
  
      if (bookingType === "daily" && !dailyPrice) {
        return res
          .status(400)
          .json({ message: "dailyPrice is required for daily bookingType" });
      }
  
      if (bookingType === "both" && (!hourlyPrice || !dailyPrice)) {
        return res
          .status(400)
          .json({
            message:
              "Both hourlyPrice and dailyPrice are required for both bookingType",
          });
      }
  
      const slot = await Slot.findById({ _id: slotId });
      if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
      }
      for (let timeSlot of slot.slots) {
        if (timeSlot.status !== "available") {
          res
            .status(400)
            .json({ message: "Slot cannot be updated as it is already booked" });
        }
      }
  
      slot.rateType = bookingType;
      if (bookingType === "hourly" || bookingType === "both") {
        slot.hourlyPrice = hourlyPrice;
      } else {
        slot.hourlyPrice = "";
      }
      if (bookingType === "daily" || bookingType === "both") {
        slot.dailyPrice = dailyPrice;
      } else {
        slot.dailyPrice = "";
      }
  
      // Update slot timings
      const startTime = new Date(
        `${slot.date.toISOString().split("T")[0]}T${slotTimings.startTime}:00`
      );
      const endTime = new Date(
        `${slot.date.toISOString().split("T")[0]}T${slotTimings.endTime}:00`
      );
      const hourlySlots = [];
  
      for (
        let time = startTime;
        time < endTime;
        time.setHours(time.getHours() + 1)
      ) {
        const slotStartTime = new Date(time);
        const slotEndTime = new Date(time);
        slotEndTime.setHours(slotEndTime.getHours() + 1);
  
        hourlySlots.push({
          startTime: slotStartTime.toISOString(),
          endTime: slotEndTime.toISOString(),
          status: "available",
        });
      }
  
      slot.slots = hourlySlots;
  
      await slot.save();
  
      res.status(200).json({ message: "Slot updated successfully", slot });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the slot", error });
    }
  };

  export const getSlotsByStudioAndDate = async (req, res) => {
    try {
      const { studioId, date, month, bookingType } = req.query;
  
      // Ensure that studioId, bookingType, and either date or month are provided
      if (!studioId || !bookingType || (!date && !month)) {
        return res.status(400).json({ message: "studioId, bookingType, and either date or month are required" });
      }
  
      let result;
      if (bookingType === 'hourly') {
        if (!date) {
          return res.status(400).json({ message: "Date is required for hourly bookingType." });
        }
        // Parse the date and ensure it's a valid Date object
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
          return res.status(400).json({ message: "Invalid date format" });
        }
        result = await getHourlySlots(studioId, parsedDate);
      } else if (bookingType === 'daily') {
        if (!month) {
          return res.status(400).json({ message: "Month is required for daily bookingType." });
        }
        result = await getDailySlots(studioId, month);
      } else {
        return res.status(400).json({ message: "Invalid bookingType. Must be 'hourly' or 'daily'." });
      }
  
      // Check if no slots are available
      if (!result || result.length === 0) {
        return res.status(200).json({ message: "No slots available for the selected date and studio." });
      }
  
      // Return the found slots or calendar
      res.status(200).json(result);
    } catch (err) {
      console.log("error", err);
      res.status(500).json({ message: 'Error fetching slots', error: err });
    }
  };


  export {createSlots,editSlot}