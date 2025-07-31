// routes/paymentRoutes.js
import express from 'express';
import { 
   createOrder,
   verifyPayment,
   getPaymentStatus,
   getAllOrdersByBooking,
   refundPayment,
   cancelBooking  // Added the new cancelBooking import
} from '../../controllers/user/payment.controller.js';
import { protect } from '../../middlewares/auth.js';

const router = express.Router();

// Create order
router.post('/create-order', protect, createOrder);

// Verify payment
router.post('/verify', protect, verifyPayment);

// Get payment status by order ID
router.get('/status/:orderId', protect, getPaymentStatus);

// Get all orders for a booking
router.get('/orders/booking/:bookingId', protect, getAllOrdersByBooking);

// Cancel booking and release slots
router.patch('/booking/:bookingId/cancel', protect, cancelBooking);

// Process refund (admin only - you might want to add admin middleware)
router.post('/refund', protect, refundPayment);

export default router;



//user/partner

// // routes/bookingRoutes.js (Optional separate booking routes file)
// import express from 'express';
// import { 
//    getUserBookings,
//    getBookingById,
//    getBookingsByEntity,
//    updateBookingStatus
// } from '../../controllers/user/booking.controller.js';
// import { protect, restrictTo } from '../../middlewares/auth.js';

// const router = express.Router();

// // Get all bookings for the authenticated user
// router.get('/user/bookings', protect, getUserBookings);

// // Get a specific booking by ID
// router.get('/:bookingId', protect, getBookingById);

// // Get all bookings for a specific studio/freelancer (partner route)
// router.get('/entity/:entityType/:entityId', protect, restrictTo('partner', 'admin'), getBookingsByEntity);

// // Update booking status (admin/partner only)
// router.patch('/:bookingId/status', protect, restrictTo('partner', 'admin'), updateBookingStatus);

// export default router;