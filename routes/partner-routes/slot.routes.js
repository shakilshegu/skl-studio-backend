import express from 'express'
import { protect } from '../../middlewares/auth.js'
import { createSlots } from '../../controllers/partner/slot.Controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Slot
 *   description: Studio slot management
 */

/**
 * @swagger
 * /aloka-api/partner/slot:
 *   post:
 *     summary: Create slots for a studio
 *     tags: [Slot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studioId
 *               - fromDate
 *               - toDate
 *               - bookingType
 *               - slotTimings
 *             properties:
 *               studioId:
 *                 type: string
 *                 description: ID of the studio
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: Start date (YYYY-MM-DD)
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: End date (YYYY-MM-DD)
 *               bookingType:
 *                 type: string
 *                 enum: [hourly, daily, both]
 *               hourlyPrice:
 *                 type: number
 *                 description: Required if bookingType is 'hourly' or 'both'
 *               dailyPrice:
 *                 type: number
 *                 description: Required if bookingType is 'daily' or 'both'
 *               slotTimings:
 *                 type: object
 *                 required:
 *                   - startTime
 *                   - endTime
 *                 properties:
 *                   startTime:
 *                     type: string
 *                     example: "09:00"
 *                   endTime:
 *                     type: string
 *                     example: "18:00"
 *     responses:
 *       201:
 *         description: Slots created successfully
 *       400:
 *         description: Validation error or slots already exist
 *       500:
 *         description: Internal server error
 */


router.post("/",protect,createSlots)

export default router