import express from 'express';
import { protect } from '../../middlewares/auth.js';
import {
  getAvailabilityByDate,
  getAvailableSlots,
  getPartnerAvailability,
  setAvailability,
  updateAvailability
} from '../../controllers/partner/availability.Controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Partner availability management
 */

/**
 * @swagger
 * /aloka-api/partner/availability:
 *   get:
 *     summary: Get availability for a partner (optionally by date range)
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Availability data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get('/', protect, getPartnerAvailability);

/**
 * @swagger
 * /aloka-api/partner/availability:
 *   post:
 *     summary: Set availability for a partner
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - unavailableSlots
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               unavailableSlots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "09:00"
 *     responses:
 *       201:
 *         description: Availability successfully set
 */
router.post('/', protect, setAvailability);

/**
 * @swagger
 * /aloka-api/partner/availability/available-slots:
 *   get:
 *     summary: Get available slots for a specific date
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date to check available slots for (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "10:00"
 */

router.get('/:date', protect, getAvailabilityByDate);

/**
 * @swagger
 * /aloka-api/partner/availability/{date}:
 *   patch:
 *     summary: Update availability for a specific date
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeSlots
 *             properties:
 *               timeSlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                       example: "08:00"
 *                     isAvailable:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Availability updated successfully
 */
router.patch('/:date', protect, updateAvailability);

/**
 * @swagger
 * /aloka-api/partner/availability/available-slots:
 *   get:
 *     summary: Get all available slots for users
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date to check available slots for
 *     responses:
 *       200:
 *         description: List of available slots
 */
router.get('/available-slots', protect, getAvailableSlots);

export default router;
