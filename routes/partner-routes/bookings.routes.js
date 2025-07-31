// routes/bookingRoutes.js

import express from 'express';
import {
  getMyBookings,
  updateBookingStatus,
  getBookingById
} from '../../controllers/partner/bookings.Controller.js';
import { protect } from '../../middlewares/auth.js';

const router = express.Router();

// Get all bookings for authenticated entity
router.get('/', protect, getMyBookings);

// Update booking status
router.patch('/:bookingId/status', protect, updateBookingStatus);

// Get single booking by ID
router.get('/:bookingId', protect, getBookingById);

export default router;