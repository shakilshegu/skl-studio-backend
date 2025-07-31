// import express from 'express';
// import { protect } from '../../middlewares/auth.js';
// import { checkStudioAvailability, getStudioAvailability, getStudioAvailabilityRange } from '../../controllers/user/availability.controller.js';
// const router = express.Router();

// // Studio availability routes
// router.get('/:studioId', getStudioAvailability);
// router.get('/:studioId/range', getStudioAvailabilityRange);
// router.post('/:studioId/check', checkStudioAvailability);


// export default router;


//using entity
// import express from 'express';
// import { protect } from '../../middlewares/auth.js';
// import { checkAvailability, getAvailability, getAvailabilityRange } from '../../controllers/user/availability.controller.js';

// const router = express.Router();

// router.get('/:entityType/:entityId', getAvailability); 
// router.get('/:entityType/:entityId/range', getAvailabilityRange); 
// router.post('/:entityType/:entityId/check', checkAvailability); 

// export default router;


import express from 'express';
import { getAvailability, getAvailabilityRange } from '../../controllers/user/availability.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailabilityRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId of the availability record
 *           example: "507f1f77bcf86cd799439011"
 *         studioId:
 *           type: string
 *           description: Studio ID (present when entityType is studio)
 *           example: "507f1f77bcf86cd799439011"
 *         freelancerId:
 *           type: string
 *           description: Freelancer ID (present when entityType is freelancer)
 *           example: "507f1f77bcf86cd799439012"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of availability
 *           example: "2024-12-25T00:00:00.000Z"
 *         isFullyBooked:
 *           type: boolean
 *           description: Whether the entire day is fully booked
 *           example: false
 *         timeSlots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimeSlot'
 *           description: Available time slots for the day
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *           example: "2024-12-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Record last update timestamp
 *           example: "2024-12-01T10:00:00.000Z"
 * 
 *     TimeSlot:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId of the time slot
 *           example: "507f1f77bcf86cd799439011"
 *         startTime:
 *           type: string
 *           pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Start time in HH:MM format
 *           example: "09:00"
 *         endTime:
 *           type: string
 *           pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: End time in HH:MM format
 *           example: "10:00"
 *         isAvailable:
 *           type: boolean
 *           description: Whether this time slot is available for booking
 *           example: true
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Error message describing what went wrong
 *           example: "Invalid entity type"
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Operation completed successfully"
 */

/**
 * @swagger
 * /aloka-api/user/availability/{entityType}/{entityId}:
 *   get:
 *     tags:
 *       - Availability
 *     summary: Get availability for a specific date
 *     description: Retrieve availability information for a studio or freelancer on a specific date. If no availability record exists, creates and returns default availability.
 *     parameters:
 *       - name: entityType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [studio, freelancer]
 *         description: Type of entity (studio or freelancer)
 *         example: studio
 *       - name: entityId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Valid MongoDB ObjectId of the entity
 *         example: 507f1f77bcf86cd799439011
 *       - name: date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *         description: Date in YYYY-MM-DD format
 *         example: 2024-12-25
 *     responses:
 *       200:
 *         description: Availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AvailabilityRecord'
 *             example:
 *               success: true
 *               message: "Availability retrieved successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 studioId: "507f1f77bcf86cd799439011"
 *                 date: "2024-12-25T00:00:00.000Z"
 *                 isFullyBooked: false
 *                 timeSlots:
 *                   - _id: "507f1f77bcf86cd799439012"
 *                     startTime: "08:00"
 *                     endTime: "09:00"
 *                     isAvailable: true
 *                   - _id: "507f1f77bcf86cd799439013"
 *                     startTime: "09:00"
 *                     endTime: "10:00"
 *                     isAvailable: true
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_entity_id:
 *                 summary: Invalid entity ID
 *                 value:
 *                   success: false
 *                   message: "Valid entity ID is required"
 *               missing_date:
 *                 summary: Missing date parameter
 *                 value:
 *                   success: false
 *                   message: "Date parameter is required"
 *               invalid_date_format:
 *                 summary: Invalid date format
 *                 value:
 *                   success: false
 *                   message: "Invalid date format. Use YYYY-MM-DD"
 *               invalid_entity_type:
 *                 summary: Invalid entity type
 *                 value:
 *                   message: "Invalid entity type"
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               studio_not_found:
 *                 summary: Studio not found
 *                 value:
 *                   success: false
 *                   message: "Studio not found"
 *               freelancer_not_found:
 *                 summary: Freelancer not found
 *                 value:
 *                   success: false
 *                   message: "freelancer not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error message"
 */
router.get('/:entityType/:entityId', getAvailability);

/**
 * @swagger
 * /aloka-api/user/availability/{entityType}/{entityId}/range:
 *   get:
 *     tags:
 *       - Availability
 *     summary: Get availability for a date range
 *     description: Retrieve availability information for a studio or freelancer within a date range (maximum 31 days). Missing dates will be filled with default availability.
 *     parameters:
 *       - name: entityType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [studio, freelancer]
 *         description: Type of entity (studio or freelancer)
 *         example: studio
 *       - name: entityId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Valid MongoDB ObjectId of the entity
 *         example: 507f1f77bcf86cd799439011
 *       - name: startDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *         description: Start date in YYYY-MM-DD format
 *         example: 2024-12-01
 *       - name: endDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *         description: End date in YYYY-MM-DD format
 *         example: 2024-12-31
 *     responses:
 *       200:
 *         description: Availability range retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/AvailabilityRecord'
 *                           - type: object
 *                             properties:
 *                               isGenerated:
 *                                 type: boolean
 *                                 description: Indicates if this record was generated with default values
 *                                 example: true
 *             example:
 *               success: true
 *               message: "Availability range retrieved successfully"
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   studioId: "507f1f77bcf86cd799439011"
 *                   date: "2024-12-01T00:00:00.000Z"
 *                   isFullyBooked: false
 *                   timeSlots:
 *                     - _id: "507f1f77bcf86cd799439012"
 *                       startTime: "08:00"
 *                       endTime: "09:00"
 *                       isAvailable: true
 *                 - date: "2024-12-02T00:00:00.000Z"
 *                   isFullyBooked: false
 *                   timeSlots:
 *                     - _id: "507f1f77bcf86cd799439013"
 *                       startTime: "08:00"
 *                       endTime: "09:00"
 *                       isAvailable: true
 *                   isGenerated: true
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_dates:
 *                 summary: Missing date parameters
 *                 value:
 *                   success: false
 *                   message: "Start and end date are required"
 *               invalid_date_order:
 *                 summary: Invalid date order
 *                 value:
 *                   success: false
 *                   message: "End date must be after start date"
 *               range_too_large:
 *                 summary: Date range too large
 *                 value:
 *                   success: false
 *                   message: "Date range cannot exceed 31 days"
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:entityType/:entityId/range', getAvailabilityRange);

export default router;
