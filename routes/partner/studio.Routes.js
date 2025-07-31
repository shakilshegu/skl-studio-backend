// api/partner/studio

import express from "express";
import {
  addStudioHandler,
  updateStudioHandler,
  getStudios,
  createSlots,
  editSlot,
  getBookingDetailsByStudioAndMonth,
  getRevenueByStudioDateWiseOrMonthly,
  getStudioDetailsById,
  getAllBookingsUpcomingAndPastBookings,
  getStudioCategories,
  getStudioDetailsByUserId,
  getEquipmentsByStudioId,
  getPackagesByStudioId,
  getServicesByStudioId,
} from "../../controllers/partner/studio.Controller.js";
import { getStudiosByFilter } from "../../controllers/studioController.js";
import upload from "../../middleware/multer.js";
import { identifyUserRoleAndId, protect } from "../../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Studios
 *   description: Studio management
 */

/**
 * @swagger
 * /api/partner/studio:
 *   post:
 *     summary: Add a new studio
 *     tags: [Studios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               studioName:
 *                 type: string
 *               studioEmail:
 *                 type: string
 *               studioMobileNumber:
 *                 type: string
 *               studioStartedDate:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               addressLineOne:
 *                 type: string
 *               addressLineTwo:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pinCode:
 *                 type: string
 *               country:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               studioDescription:
 *                 type: string
 *               studioType:
 *                 type: string
 *               ownerName:
 *                 type: string
 *               ownerEmail:
 *                 type: string
 *               ownerPhoneNumber:
 *                 type: string
 *               ownerGender:
 *                 type: string
 *               ownerDateOfBirth:
 *                 type: string
 *               studioLogo:
 *                 type: string
 *                 format: binary
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Studio created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to create studio
 */
router.post(
  "",protect,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "studioLogo", maxCount: 1 }
  ]),
  addStudioHandler
);
/**
 * @swagger
 * /api/partner/studio/{id}:
 *   put:
 *     summary: Update an existing studio
 *     tags: [Studios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               studioEmail:
 *                 type: string
 *               studioMobileNumber:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               addressLineOne:
 *                 type: string
 *               addressLineTwo:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pinCode:
 *                 type: string
 *               country:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               studioDescription:
 *                 type: string
 *               title:
 *                 type: string
 *               perHour:
 *                 type: number
 *               perDay:
 *                 type: number
 *               type:
 *                 type: string
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               ownerName:
 *                 type: string
 *               ownerEmail:
 *                 type: string
 *               ownerPhoneNumber:
 *                 type: string
 *               ownerGender:
 *                 type: string
 *               ownerDateOfBirth:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Studio updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Studio not found
 *       500:
 *         description: Failed to update studio
 */
router.put(
  "/:id",
  upload.fields([{ name: "photos", maxCount: 10 }]),
  updateStudioHandler
);

/**
 * @swagger
 * /api/partner/studio/addSlots:
 *   post:
 *     summary: Create new slots for a studio
 *     tags: [Studios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studioId:
 *                 type: string
 *                 description: The ID of the studio
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: The start date for the slots
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: The end date for the slots
 *               bookingType:
 *                 type: string
 *                 enum: [hourly, daily, both]
 *                 description: The type of booking
 *               hourlyPrice:
 *                 type: number
 *                 description: The price per hour
 *               dailyPrice:
 *                 type: number
 *                 description: The price per day
 *               slotTimings:
 *                 type: object
 *                 properties:
 *                   startTime:
 *                     type: string
 *                     description: The start time for the slots (HH:MM format)
 *                   endTime:
 *                     type: string
 *                     description: The end time for the slots (HH:MM format)
 *     responses:
 *       201:
 *         description: Slots created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/addSlots", createSlots); // partner

/**
 * @swagger
 * /api/partner/studio/editSlot:
 *   post:
 *     summary: Edit an existing slot
 *     tags: [Studios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slotId:
 *                 type: string
 *                 description: The ID of the slot to be edited
 *               bookingType:
 *                 type: string
 *                 enum: [hourly, daily, both]
 *                 description: The type of booking
 *               hourlyPrice:
 *                 type: number
 *                 description: The price per hour
 *               dailyPrice:
 *                 type: number
 *                 description: The price per day
 *               slotTimings:
 *                 type: object
 *                 properties:
 *                   startTime:
 *                     type: string
 *                     description: The start time for the slots (HH:MM format)
 *                   endTime:
 *                     type: string
 *                     description: The end time for the slots (HH:MM format)
 *     responses:
 *       200:
 *         description: Slot updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Internal server error
 */
router.post("/editSlot", editSlot); // partner

/**
 * @swagger
 * /api/partner/studio/:
 *   get:
 *     summary: "Retrieve all partner studios"
 *     description: "Fetches a list of all studios stored in the database."
 *     operationId: "getStudios"
 *     tags:
 *       - "Studio"
 *     responses:
 *       200:
 *         description: "A list of studios retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Studios retrieved successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d6f5f2b9345a4d89c8f214"
 *                       name:
 *                         type: string
 *                         example: "Studio ABC"
 *                       studioEmail:
 *                         type: string
 *                         example: "studioabc@example.com"
 *                       studioMobileNumber:
 *                         type: string
 *                         example: "+1234567890"
 *                       gstNumber:
 *                         type: string
 *                         example: "123ABC456"
 *                       address:
 *                         type: object
 *                         properties:
 *                           addressLineOne:
 *                             type: string
 *                             example: "123 Street Name"
 *                           addressLineTwo:
 *                             type: string
 *                             example: "Building 5, Apt 2"
 *                           city:
 *                             type: string
 *                             example: "Cityville"
 *                           state:
 *                             type: string
 *                             example: "Stateville"
 *                           pinCode:
 *                             type: string
 *                             example: "12345"
 *                           country:
 *                             type: string
 *                             example: "Countryland"
 *                       location:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                             example: 37.7749
 *                           lng:
 *                             type: number
 *                             example: -122.4194
 *                       studioDescription:
 *                         type: string
 *                         example: "A beautiful studio perfect for photo shoots."
 *                       studioImages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "/uploads/studio1.jpg"
 *                           - "/uploads/studio2.jpg"
 *       404:
 *         description: "No studios found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No studios found."
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: "Server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch studios."
 */
router.get("/", getStudios);

/**
 * @swagger
 * /api/partner/studio/getBookingByMonth:
 *   get:
 *     summary: Retrieve booking details for a studio by month and year
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the studio
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: The month for which to retrieve bookings (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year for which to retrieve bookings
 *     responses:
 *       200:
 *         description: A list of booking details categorized by date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   upcoming:
 *                     type: array
 *                     description: List of upcoming bookings for the date
 *                     items:
 *                       $ref: '#/components/schemas/Booking'
 *                   ongoing:
 *                     type: array
 *                     description: List of ongoing bookings for the date
 *                     items:
 *                       $ref: '#/components/schemas/Booking'
 *                   completed:
 *                     type: array
 *                     description: List of completed bookings for the date
 *                     items:
 *                       $ref: '#/components/schemas/Booking'
 *                   cancelled:
 *                     type: array
 *                     description: List of cancelled bookings for the date
 *                     items:
 *                       $ref: '#/components/schemas/Booking'
 *                   count:
 *                     type: integer
 *                     description: Total number of bookings for the date
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "studioId, month, and year are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving booking details"
 *
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         studio:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                 street:
 *                   type: string
 *         slot:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             date:
 *               type: string
 *               format: date
 *             startTime:
 *               type: string
 *             endTime:
 *               type: string
 *             status:
 *               type: string
 *         slotTiming:
 *           type: object
 *           properties:
 *             startTime:
 *               type: string
 *             endTime:
 *               type: string
 *         paymentStatus:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.get("/getBookingByMonth", getBookingDetailsByStudioAndMonth);

/**
 * @swagger
 * /api/partner/studio/{studioId}/details:
 *   get:
 *     summary: Get studio details by ID
 *     tags: [Studios]
 *     parameters:
 *       - in: path
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *     responses:
 *       200:
 *         description: Successfully retrieved studio details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studio:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     description: { type: string }
 *                     location: { type: object }
 *                     title: { type: string }
 *                     price: { type: object }
 *                     type: { type: string }
 *                     isVerified: { type: boolean }
 *                     isDeleted: { type: boolean }
 *                     isComplete: { type: boolean }
 *                     createdAt: { type: string }
 *                     updatedAt: { type: string }
 *                     facilities: { type: array }
 *                     reviews: { type: array }
 *                     images: { type: array }
 *                     videos: { type: string }
 *                 orders: { type: array }
 *                 equipment: { type: array }
 *                 services: { type: array }
 *                 packages: { type: array }
 *                 averageRating: { type: number }
 *       500:
 *         description: Internal server error
 */
router.get("/:studioId/details", getStudioDetailsById);
/**
 * @swagger
 * /api/partner/studio/revenueByStudioDateWiseOrMonthWise:
 *   get:
 *     summary: Get revenue by studio date-wise or month-wise
 *     description: Retrieve the revenue for a specific studio either month-wise for a given year or date-wise for a given month and year.
 *     tags:
 *       - Studio
 *     parameters:
 *       - in: query
 *         name: studioId
 *         required: true
 *         description: The ID of the studio
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         required: true
 *         description: The year for which to retrieve the revenue
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: false
 *         description: The month for which to retrieve the revenue (optional)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of revenue data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revenueList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: integer
 *                         description: The month number (1-12)
 *                         example: 1
 *                       revenue:
 *                         type: number
 *                         description: The total revenue for the month
 *                         example: 5000
 *                       day:
 *                         type: integer
 *                         description: The day number (1-31)
 *                         example: 1
 *                       revenue:
 *                         type: number
 *                         description: The total revenue for the day
 *                         example: 500
 *       400:
 *         description: Bad request, missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: studioId and year are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get(
  "/revenueByStudioDateWiseOrMonthWise",
  getRevenueByStudioDateWiseOrMonthly
);

/**
 * @swagger
 * /api/partner/studio/getStudioBookingsPastAndFutureBookings:
 *   get:
 *     summary: Get all bookings (upcoming and past) based on current Date
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 upcomingBookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       user: { type: object }
 *                       studio: { type: object }
 *                       slot: { type: object }
 *                       slotTiming: { type: object }
 *                       paymentStatus: { type: string }
 *                       createdAt: { type: string }
 *                 pastBookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       user: { type: object }
 *                       studio: { type: object }
 *                       slot: { type: object }
 *                       slotTiming: { type: object }
 *                       paymentStatus: { type: string }
 *                       createdAt: { type: string }
 *       400:
 *         description: studioId is required
 *       404:
 *         description: No bookings found for this studio
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getStudioBookingsPastAndFutureBookings",
  getAllBookingsUpcomingAndPastBookings
);

/**
 * @swagger
 * /api/partner/studio/categories:
 *   get:
 *     summary: Retrieve a list of studio categories
 *     tags: [Studios]
 *     responses:
 *       200:
 *         description: A list of studio categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
console.log("hitting here ----");
router.post(
  "",
  identifyUserRoleAndId,
  upload.fields([{ name: "photos", maxCount: 10 }]),
  addStudioHandler
);
router.put(
  "/:id",
  identifyUserRoleAndId,
  upload.fields([{ name: "photos", maxCount: 10 }]),
  updateStudioHandler
);

// testing purpose with out middleware
// router.post('',  upload.fields([{ name: 'photos', maxCount: 10 }]), addStudioHandler);
// router.put('/:id',   upload.fields([{ name: 'photos', maxCount: 10 }]), updateStudioHandler);

/**
 * @swagger
 * /api/partner/studio/user/{userId}:
 *   get:
 *     summary: Get studio details by user ID
 *     tags: [Studios]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved studio details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studio:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     description: { type: string }
 *                     location: { type: object }
 *                     equipments: { type: array }
 *                     services: { type: array }
 *                     packages: { type: array }
 *                     title: { type: string }
 *                     price: { type: object }
 *                     type: { type: string }
 *                     isVerified: { type: boolean }
 *                     isDeleted: { type: boolean }
 *                     isComplete: { type: boolean }
 *                     createdAt: { type: string }
 *                     updatedAt: { type: string }
 *                     facilities: { type: array }
 *                     reviews: { type: array }
 *                     images: { type: array }
 *                     videos: { type: string }
 *                 orders: { type: array }
 *                 equipment: { type: array }
 *                 services: { type: array }
 *                 packages: { type: array }
 *                 averageRating: { type: number }
 *       500:
 *         description: Internal server error
 */

router.get("/details",protect, getStudioDetailsByUserId);

/**
 * @swagger
 * /api/partner/studio/equipments:
 *   get:
 *     summary: Get equipments by studio ID
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *     responses:
 *       200:
 *         description: Successfully retrieved equipments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   description: { type: string }
 *                   price: { type: number }
 *                   quantity: { type: number }
 *       400:
 *         description: studioId is required
 *       404:
 *         description: No equipments found for this studio
 *       500:
 *         description: Internal server error
 */
router.get("/equipments", getEquipmentsByStudioId);

/**
 * @swagger
 * /api/partner/studio/services:
 *   get:
 *     summary: Get services by studio ID
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *     responses:
 *       200:
 *         description: Successfully retrieved services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   description: { type: string }
 *                   price: { type: number }
 *       400:
 *         description: studioId is required
 *       404:
 *         description: No services found for this studio
 *       500:
 *         description: Internal server error
 */
router.get("/services", getServicesByStudioId);

/**
 * @swagger
 * /api/partner/studio/packages:
 *   get:
 *     summary: Get packages by studio ID
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *     responses:
 *       200:
 *         description: Successfully retrieved packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   description: { type: string }
 *                   price: { type: number }
 *       400:
 *         description: studioId is required
 *       404:
 *         description: No packages found for this studio
 *       500:
 *         description: Internal server error
 */
router.get("/packages", getPackagesByStudioId);

/**
 * @swagger
 * /api/partner/studio/filter:
 *   get:
 *     summary: Filter studios based on various criteria
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: The city to filter studios by
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: The minimum price per day
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: The maximum price per day
 *       - in: query
 *         name: ratings
 *         schema:
 *           type: number
 *         description: The minimum rating
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The type of studio
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: The date to check availability
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: time
 *         description: The start time to check availability
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: time
 *         description: The end time to check availability
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: The latitude for location-based filtering
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: The longitude for location-based filtering
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *         description: The maximum distance in kilometers for location-based filtering
 *     responses:
 *       200:
 *         description: Studios retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Studios retrieved successfully.
 *                 count:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c83
 *                       name:
 *                         type: string
 *                         example: Studio One
 *                       studioEmail:
 *                         type: string
 *                         example: studioone@example.com
 *                       studioMobileNumber:
 *                         type: string
 *                         example: 1234567890
 *                       gstNumber:
 *                         type: string
 *                         example: 22AAAAA0000A1Z5
 *                       address:
 *                         type: object
 *                         properties:
 *                           addressLineOne:
 *                             type: string
 *                             example: 123 Main St
 *                           addressLineTwo:
 *                             type: string
 *                             example: Suite 100
 *                           city:
 *                             type: string
 *                             example: Example City
 *                           state:
 *                             type: string
 *                             example: Example State
 *                           pinCode:
 *                             type: string
 *                             example: 123456
 *                           country:
 *                             type: string
 *                             example: Example Country
 *                       location:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                             example: 12.9715987
 *                           lng:
 *                             type: number
 *                             example: 77.5945627
 *                       studioDescription:
 *                         type: string
 *                         example: This is an example studio.
 *                       title:
 *                         type: string
 *                         example: Example Title
 *                       price:
 *                         type: object
 *                         properties:
 *                           perHour:
 *                             type: number
 *                             example: 100
 *                           perDay:
 *                             type: number
 *                             example: 800
 *                       type:
 *                         type: string
 *                         example: Photo Studio
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       isComplete:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T00:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T00:00:00.000Z
 *                       facilities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - WiFi
 *                           - Parking
 *                       owner:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             example: 60d21b4667d0d8992e610c83
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: owner@example.com
 *                           mobileNumber:
 *                             type: string
 *                             example: 0987654321
 *                           gender:
 *                             type: string
 *                             example: Male
 *                           dateOfBirth:
 *                             type: string
 *                             format: date
 *                             example: 1980-01-01
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - image1.jpg
 *                           - image2.jpg
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             user:
 *                               type: string
 *                               example: 60d21b4667d0d8992e610c83
 *                             rating:
 *                               type: number
 *                               example: 5
 *                             comment:
 *                               type: string
 *                               example: Great studio!
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2023-10-01T00:00:00.000Z
 *       400:
 *         description: Bad request
 *       404:
 *         description: No studios found matching the given criteria
 *       500:
 *         description: An error occurred while fetching studios by filter
 */
router.get("/filter", getStudiosByFilter);

export default router;
