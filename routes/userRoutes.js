// api/users

import express from 'express';
const router = express.Router();
import { getUsersByRole } from '../controllers/adminController/userController.js';
import { getUserBookingsByDateRange } from '../controllers/bookingController.js';

/**
 * @swagger
 * api/users:
 *   get:
 *     summary: Get users by role
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID
 *                   name:
 *                     type: string
 *                     description: The user name
 *                   role:
 *                     type: string
 *                     description: The user role
 *       500:
 *         description: Internal server error
 */
router.get('', getUsersByRole); // Get users by role

/**
 * @swagger
 * /api/users/booking:
 *   get:
 *     summary: Get user bookings by date range
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: The start date of the range
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: The end date of the range
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The booking ID
 *                   user:
 *                     type: string
 *                     description: The user ID
 *                   studio:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   totalHours:
 *                     type: number
 *                   totalPrice:
 *                     type: number
 *                   status:
 *                     type: string
 *                   cart:
 *                     type: object
 *                     properties:
 *                       bookingType:
 *                         type: string
 *                       dailySlots:
 *                         type: array
 *                         items:
 *                           type: object
 *                       hourlySlots:
 *                         type: array
 *                         items:
 *                           type: object
 *       500:
 *         description: Internal server error
 */
router.get('/booking', getUserBookingsByDateRange);

export default router;