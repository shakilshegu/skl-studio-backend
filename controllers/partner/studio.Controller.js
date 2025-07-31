import { uploadFile } from "../../utils/mediaHelper.js";
import { sendResponse } from "../../utils/responseUtils.js";

import Partner from "../../models/partner/partner.Model.js";
import Slot from "../../models/slotModel.js";
import Cart from "../../models/cartModel.js";
import Studio from "../../models/partner/studio.Model.js";
import User from "../../models/userModel.js";
import Equipment from "../../models/partner/equipment.Model.js";
import Services from "../../models/partner/service.Model.js";
import Packages from "../../models/partner/package.Model.js";
import mongoose from "mongoose";
import { log } from "util";

export const getStudioCategories = (req, res) => {
  const studioTypes = [
    "Photo Studio",
    "Conference Room",
    "Dance Studio",
    "Recording Studio",
    "Film Studio",
    "Corporate Events",
  ];
  res.status(200).json({
    message: "Studio types retrieved successfully",
    data: studioTypes,
  });
};
const addStudioHandler = async (req, res) => {
  try {
    const {
      studioName,
      studioEmail,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      addressLineOne,
      addressLineTwo,
      city,
      state,
      pinCode,
      country,
      lat,
      lng,
      studioDescription,
      studioType,
      ownerName,
      ownerEmail,
      ownerPhoneNumber,
      ownerGender,
      ownerDateOfBirth,
    } = req.body;
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user already has a studio
    const existingStudio = await Studio.findOne({ owner: userId });
    if (existingStudio) {
      return res.status(400).json({ message: "User already has a studio" });
    }
    const files = req.files;
    const studioLogo = files?.studioLogo?.[0];
    const uploadLogo = await uploadFile(
      studioLogo,
      `studio/${studioLogo.filename}`
    );
    let uploadedPhotos = [];
    if (files?.photos) {
      for (const file of files.photos) {
        const uploadedFilePath = await uploadFile(
          file,
          `studio/${file.filename}`
        );
        uploadedPhotos.push(uploadedFilePath);
      }
    }

    const newStudio = new Studio({
      studioName,
      studioEmail,
      studioLogo: uploadLogo,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      type: studioType,
      address: {
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        country,
      },
      location: {
        lat,
        lng,
      },
      studioDescription,
      owner: {
        userId: userId,
        name: ownerName,
        email: ownerEmail,
        mobileNumber: ownerPhoneNumber,
        gender: ownerGender,
        dateOfBirth: ownerDateOfBirth,
      },
      images: uploadedPhotos,
      isVerified: false,
    });

    const savedStudio = await newStudio.save();

    return sendResponse(res, true, "Studio created successfully.", savedStudio);
  } catch (error) {
    console.error("Error creating studio:", error);
    return sendResponse(res, false, "Failed to create studio.", error.message);
  }
};
const updateStudioHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studioName,
      studioEmail,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      addressLineOne,
      addressLineTwo,
      city,
      state,
      pinCode,
      country,
      lat,
      lng,
      studioDescription,
      studioType,
      ownerName,
      ownerEmail,
      ownerPhoneNumber,
      ownerGender,
      ownerDateOfBirth,
    } = req.body;

    const existingStudio = await Studio.findById(id);
    if (!existingStudio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const files = req.files;
    let studioLogo = existingStudio.studioLogo;
    if (files?.studioLogo?.[0]) {
      studioLogo = await uploadFile(
        files.studioLogo[0],
        `studio/${files.studioLogo[0].filename}`
      );
    }

    let uploadedPhotos = existingStudio.images || [];
    if (files?.photos) {
      uploadedPhotos = [];
      for (const file of files.photos) {
        const uploadedFilePath = await uploadFile(
          file,
          `studio/${file.filename}`
        );
        uploadedPhotos.push(uploadedFilePath);
      }
    }

    const updateData = {
      studioName,
      studioEmail,
      studioLogo,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      type: studioType,
      address: {
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        country,
      },
      location: {
        lat,
        lng,
      },
      studioDescription,
      owner: {
        userId: existingStudio.owner.userId,
        name: ownerName,
        email: ownerEmail,
        mobileNumber: ownerPhoneNumber,
        gender: ownerGender,
        dateOfBirth: ownerDateOfBirth,
      },
      images: uploadedPhotos,
    };

    const updatedStudio = await Studio.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return sendResponse(
      res,
      true,
      "Studio updated successfully.",
      updatedStudio
    );
  } catch (error) {
    console.error("Error updating studio:", error);
    return sendResponse(res, false, "Failed to update studio.", error.message);
  }
};

const getStudios = async (req, res) => {
  try {
    const studios = await Studio.find({});
    // const studios = await PartnerStudio.find({});
    if (studios.length === 0) {
      return sendResponse(res, true, "No studios found.", []);
    }
    return sendResponse(res, true, "Studios retrieved successfully.", studios);
  } catch (error) {
    console.error("Error fetching studios:", error); // Logging the error for debugging
    return sendResponse(res, false, "Failed to fetch studios.", error.message);
  }
};

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

export default createSlots;

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

// booking details of a studio for a given month

const getBookingDetailsByStudioAndMonth = async (req, res) => {
  try {
    const { studioId, month, year } = req.query;
    // Input validation
    if (!studioId || !month || !year) {
      return res
        .status(400)
        .json({ message: "studioId, month, and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const currentDate = new Date();

    const carts = await Cart.find({
      studio: studioId,
      createdAt: { $gte: startDate, $lte: endDate },
      paymentStatus: { $ne: "pending" },
    })
      .populate({
        path: "slot",
        select: "date", // Only populate the date field of the slot
      })
      .lean();

    const categorizedCarts = {};

    // Initialize month dates
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      categorizedCarts[dateStr] = {
        upcoming: [],
        ongoing: [],
        completed: [],
        cancelled: [],
        count: 0,
      };
    }

    carts.forEach((cart) => {
      if (!cart.slot || !cart.slot.date) return; // Skip invalid carts

      const slotDate = new Date(cart.slot.date).toISOString().split("T")[0];

      // Ensure date exists in categorizedCarts
      if (!categorizedCarts[slotDate]) return;

      // Categorization logic
      if (cart.status === "cancelled") {
        categorizedCarts[slotDate].cancelled.push(cart);
      } else if (slotDate < currentDate.toISOString().split("T")[0]) {
        categorizedCarts[slotDate].completed.push(cart);
      } else {
        categorizedCarts[slotDate].upcoming.push(cart);
      }

      categorizedCarts[slotDate].count += 1;
    });

    res.status(200).json(categorizedCarts);
  } catch (error) {
    console.error("Booking details error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", details: error.message });
  }
};

const getStudioDetailsById = async (req, res) => {
  try {
    const { studioId } = req.params;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    const studio = await Studio.findById(studioId);

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const orders = await Cart.find({
      studio: studioId,
      paymentStatus: "pending",
    });

    // Calculate average rating
    const averageRating =
      studio.reviews.length > 0
        ? studio.reviews.reduce((acc, review) => acc + review.rating, 0) /
          studio.reviews.length
        : 0;

    res.status(200).json({
      studio,
      orders,
      averageRating,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching studio details",
        error,
      });
  }
};

const getRevenueByStudioDateWiseOrMonthly = async (req, res) => {
  try {
    const { studioId, month, year } = req.params;
    if (!studioId || !year) {
      return res
        .status(400)
        .json({ message: "studioId and year are required" });
    }

    let revenueList = [];
    if (!month) {
      // If only year is provided, return month-wise revenue
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const carts = await Cart.find({
        studio: studioId,
        paymentStatus: { $ne: "pending" },
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const monthlyRevenue = {};
      carts.forEach((cart) => {
        const cartMonth = cart.createdAt.getMonth() + 1; // getMonth() is zero-based
        if (!monthlyRevenue[cartMonth]) {
          monthlyRevenue[cartMonth] = 0;
        }
        monthlyRevenue[cartMonth] += cart.totalAmount;
      });

      revenueList = Object.keys(monthlyRevenue).map((month) => ({
        month: parseInt(month),
        revenue: monthlyRevenue[month],
      }));

      res.status(200).json({ revenueList });
    } else {
      // If both month and year are provided, return date-wise revenue
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      const carts = await Cart.find({
        studio: studioId,
        paymentStatus: { $ne: "pending" },
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const dailyRevenue = {};
      carts.forEach((cart) => {
        const cartDate = cart.createdAt.getDate();
        if (!dailyRevenue[cartDate]) {
          dailyRevenue[cartDate] = 0;
        }
        dailyRevenue[cartDate] += cart.totalAmount;
      });

      revenueList = Object.keys(dailyRevenue).map((day) => ({
        day: parseInt(day),
        revenue: dailyRevenue[day],
      }));

      res.status(200).json({ revenueList });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for the current date, next 10 future bookings, and last 10 past bookings with paymentStatus "paid" and status "completed"
const getAllBookingsUpcomingAndPastBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 10);

    // Fetch current date bookings
    const currentDateBookings = await Cart.find({
      paymentStatus: { $ne: "pending" },
      status: "upcoming",
    })
      .populate({
        path: "slot",
        match: { date: currentDate }, // Assuming the Slot model has a date field
      })
      .populate("user")
      .populate("studio");

    // Filter out bookings where the slot date is not equal to the current date
    const filteredCurrentDateBookings = currentDateBookings.filter(
      (booking) => booking.slot
    );

    // Fetch next 10 future bookings
    const futureBookings = await Cart.find({
      paymentStatus: { $ne: "pending" },
      status: "upcoming",
    })
      .populate({
        path: "slot",
        match: { date: { $gt: currentDate } }, // Assuming the Slot model has a date field
      })
      .populate("user")
      .populate("studio")
      .sort({ "slot.date": 1 })
      .limit(10);

    // Filter out bookings where the slot date is not greater than the current date
    const filteredFutureBookings = futureBookings.filter(
      (booking) => booking.slot
    );

    // Fetch last 10 past bookings with paymentStatus "paid" and status "completed"
    const pastBookings = await Cart.find({
      paymentStatus: "paid",
      status: "completed",
      updatedAt: { $gte: pastDate, $lt: currentDate },
    })
      .populate("user")
      .populate("studio")
      .sort({ updatedAt: -1 })
      .limit(10);

    res.status(200).json({
      currentDateBookings: filteredCurrentDateBookings,
      futureBookings: filteredFutureBookings,
      pastBookings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching bookings", error });
  }
};

const getStudioDetailsByUserId = async (req, res) => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const studio = await Studio.findOne({ "owner.userId": userId })
      // .populate("equipments")
      // .populate("services")
      // .populate("packages");
    // console.log("studio", studio);

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const orders = await Cart.find({
      studio: studio._id,
      paymentStatus: "pending",
    });
    const equipment = studio.equipments;
    const services = studio.services;
    const packages = studio.packages;

    // Calculate average rating
    const averageRating =
      studio.reviews.length > 0
        ? studio.reviews.reduce((acc, review) => acc + review.rating, 0) /
          studio.reviews.length
        : 0;

    res.status(200).json({
      studio,
      orders,
      equipment,
      services,
      packages,
      averageRating,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching studio details",
        error,
      });
  }
};

const getRevenueByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    if (!userId || !year) {
      return res.status(400).json({ message: "userId and year are required" });
    }

    const studio = await Studio.findOne({ owner: userId });

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    let revenueList = [];
    if (!month) {
      // If only year is provided, return month-wise revenue
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const carts = await Cart.find({
        studio: studio._id,
        paymentStatus: { $ne: "pending" },
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const monthlyRevenue = {};
      carts.forEach((cart) => {
        const cartMonth = cart.createdAt.getMonth() + 1; // getMonth() is zero-based
        if (!monthlyRevenue[cartMonth]) {
          monthlyRevenue[cartMonth] = 0;
        }
        const totalPaid = cart.partialPayments.reduce(
          (partialSum, payment) => partialSum + payment.amount,
          0
        );
        monthlyRevenue[cartMonth] += totalPaid;
      });

      revenueList = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        revenue: monthlyRevenue[i + 1] || 0,
      }));

      res.status(200).json({ revenueList });
    } else {
      // If both month and year are provided, return date-wise revenue
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      const carts = await Cart.find({
        studio: studio._id,
        paymentStatus: { $ne: "pending" },
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const dailyRevenue = {};
      carts.forEach((cart) => {
        const cartDate = cart.createdAt.getDate();
        if (!dailyRevenue[cartDate]) {
          dailyRevenue[cartDate] = 0;
        }
        const totalPaid = cart.partialPayments.reduce(
          (partialSum, payment) => partialSum + payment.amount,
          0
        );
        dailyRevenue[cartDate] += totalPaid;
      });

      const daysInMonth = new Date(year, month, 0).getDate();
      revenueList = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        revenue: dailyRevenue[i + 1] || 0,
      }));

      res.status(200).json({ revenueList });
    }
  } catch (error) {
    console.error("An error occurred while fetching revenue:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching revenue", error });
  }
};

const getEquipmentsByStudioId = async (req, res) => {
  try {
    const { studioId } = req.query;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    const equipments = await Equipment.find({ studioId });

    if (!equipments.length) {
      return res
        .status(404)
        .json({ message: "No equipments found for this studio" });
    }

    res.status(200).json(equipments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching equipments", error });
  }
};

const getServicesByStudioId = async (req, res) => {
  try {
    const { studioId } = req.query;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    const services = await Services.find({ studioId });

    if (!services.length) {
      return res
        .status(404)
        .json({ message: "No services found for this studio" });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching services", error });
  }
};

const getPackagesByStudioId = async (req, res) => {
  try {
    const { studioId } = req.query;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    const packages = await Packages.find({ studioId });

    if (!packages.length) {
      return res
        .status(404)
        .json({ message: "No packages found for this studio" });
    }

    res.status(200).json(packages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching packages", error });
  }
};

export {
  getStudios,
  updateStudioHandler,
  addStudioHandler,
  createSlots,
  editSlot,
  getBookingDetailsByStudioAndMonth,
  getStudioDetailsById,
  getAllBookingsUpcomingAndPastBookings,
  getRevenueByStudioDateWiseOrMonthly,
  getStudioDetailsByUserId,
  getRevenueByUserId,
  getEquipmentsByStudioId,
  getServicesByStudioId,
  getPackagesByStudioId,
};
