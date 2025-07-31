// routes/userRoutes.js
import express from "express";
import { protect } from "../../middlewares/auth.js";
import { getUserBookings,getBookingDetails } from "../../controllers/user/booking.controller.js";

const router = express.Router();

// Booking routes
router.get("/", protect, getUserBookings);
router.get("/:bookingId", protect, getBookingDetails);

export default router;