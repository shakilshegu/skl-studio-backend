// api/studio
import express from 'express';
import { getAllStudios, getStudioById ,getStudiosOnAllCategories , getStudiosByFilter , getAvailableStudios , getBookingDetailsByDateRange  , getAllStudioCategoriesWithStudios, randomStudios, getCategoryStudios  } from "../controllers/studioController.js"
import { protect, authorizeRoles } from '../middleware/auth.js';
import { uploadFile } from '../utils/mediaHelper.js';
import upload from "../middleware/multer.js"
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Studio:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: object     
 *           properties:
 *             flat:
 *               type: string
 *             addressOne:
 *               type: string
 *             addressTwo:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             area:
 *               type: string
 *             pinCode:
 *               type: string
 *             country:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                 lng:
 *                   type: number
 *         equipments:
 *           type: array
 *           items:
 *             type: string
 *             description: ObjectId reference to Equipment
 *         services:
 *           type: array
 *           items:
 *             type: string
 *             description: ObjectId reference to Service
 *         packages:
 *           type: array
 *           items:
 *             type: string
 *             description: ObjectId reference to Package
 *         title:
 *           type: string
 *         spaceSize:
 *           type: string
 *         price:
 *           type: object
 *           properties:
 *             perHour:
 *               type: number
 *             perDay:
 *               type: number
 *         type:
 *           type: string
 *           enum: ['Photo Studio', 'Conference Room', 'Dance Studio', 'Recording Studio', 'Film Studio', 'Corporate Events']
 *         isVerified:
 *           type: boolean
 *           default: false
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         isComplete:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         facilities:
 *           type: array
 *           items:
 *             type: string
 *         partner:
 *           type: string
 *           description: ObjectId reference to Partner
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ObjectId reference to User
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         videos:
 *           type: string
 *
 * tags:
 *   name: Studios
 *   description: Studio management endpoints
 *
 * /api/studio:
 *   get:
 *     summary: Get all studios
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter studios by type
 *       - in: query
 *         name: location.city
 *         schema:
 *           type: string
 *         description: Filter studios by city
 *     responses:
 *       200:
 *         description: A list of studios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Studio'
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/studio/filter-studios:
 *   get:
 *     summary: Filter and retrieve studios
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter studios by location (city). Case-insensitive partial match.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price for filtering studios.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price for filtering studios.
 *       - in: query
 *         name: ratings
 *         schema:
 *           type: number
 *         description: Minimum rating for filtering studios.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The type of the studio 
 *     responses:
 *       200:
 *         description: A list of filtered studios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Filtered studios retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Studio'
 *       201:
 *         description: No studios matched the filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Studios found"
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving studios"
 */

/**
 * @swagger
 * /api/studio/studiosOnAllCategory:
 *   get:
 *     summary: Retrieve studios of each category, limited to 2 studios per category
 *     tags: [Studios]
 *     responses:
 *       200:
 *         description: A list of categories with their respective studios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       studios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             studioEmail:
 *                               type: string
 *                             studioMobileNumber:
 *                               type: string
 *                             gstNumber:
 *                               type: string
 *                             address:
 *                               type: object
 *                               properties:
 *                                 addressLineOne:
 *                                   type: string
 *                                 addressLineTwo:
 *                                   type: string
 *                                 city:
 *                                   type: string
 *                                 state:
 *                                   type: string
 *                                 pinCode:
 *                                   type: string
 *                                 country:
 *                                   type: string
 *                             location:
 *                               type: object
 *                               properties:
 *                                 lat:
 *                                   type: number
 *                                 lng:
 *                                   type: number
 *                             studioDescription:
 *                               type: string
 *                             title:
 *                               type: string
 *                             price:
 *                               type: object
 *                               properties:
 *                                 perHour:
 *                                   type: number
 *                                 perDay:
 *                                   type: number
 *                             type:
 *                               type: string
 *                             isVerified:
 *                               type: boolean
 *                             isDeleted:
 *                               type: boolean
 *                             isComplete:
 *                               type: boolean
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                             facilities:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             owner:
 *                               type: object
 *                               properties:
 *                                 userId:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 email:
 *                                   type: string
 *                                 mobileNumber:
 *                                   type: string
 *                                 gender:
 *                                   type: string
 *                                 dateOfBirth:
 *                                   type: string
 *                                   format: date
 *                             images:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             reviews:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   user:
 *                                     type: string
 *                                   rating:
 *                                     type: number
 *                                   comment:
 *                                     type: string
 *                                   createdAt:
 *                                     type: string
 *                                     format: date-time
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

router.get('/', getAllStudios);
router.get('/filter-studios', getStudiosByFilter);

/**
 * @swagger
 * /api/studio/studiosOnAllCategory:
 *   get:
 *     summary: Retrieve all categories with a limited number of studios for each
 *     description: Fetch all categories and include up to 2 verified studios for each category.
 *     tags: [Studios]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories with studios
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
 *                   example: "Categories with studios retrieved successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: "Fitness"
 *                       studios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "Studio A"
 *                             studioEmail:
 *                               type: string
 *                               example: "studioa@example.com"
 *                             studioMobileNumber:
 *                               type: string
 *                               example: "+1234567890"
 *                             studioDescription:
 *                               type: string
 *                               example: "A description of Studio A."
 *                             title:
 *                               type: string
 *                               example: "Premium Studio"
 *                             price:
 *                               type: number
 *                               example: 100.0
 *                             image:
 *                               type: string
 *                               example: "https://example.com/image.jpg"
 *       500:
 *         description: Server error
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
 *                   example: "Error fetching categories with studios"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/studiosOnAllCategory', getStudiosOnAllCategories)

// router.get('/studioByCategories', getAllStudioCategoriesWithStudios);


/**
 * @swagger
 * /api/studio/getAvailableStudios:
 *   get:
 *     summary: Retrieve available studios based on date, time, and city
 *     tags: [Studios]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date to check for available studios
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: time
 *         required: true
 *         description: The start time to check for available studios
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: time
 *         required: true
 *         description: The end time to check for available studios
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: The city to check for available studios
 *     responses:
 *       200:
 *         description: A list of available studios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studioId:
 *                     type: string
 *                     description: The ID of the studio
 *                   slots:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         startTime:
 *                           type: string
 *                           format: time
 *                         endTime:
 *                           type: string
 *                           format: time
 *                         status:
 *                           type: string
 *                           example: available
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Date, startTime, endTime, and city are required"
 *       404:
 *         description: No available studios found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No available studios found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving studios"
 */
router.get('/getAvailableStudios', getAvailableStudios);
/**
 * @swagger
 * /api/studio/getBookingDetailsByDateRange:
 *   get:
 *     summary: Get cart details by date range
 *     description: Retrieve cart details for a user within a specified date range, categorized by upcoming, ongoing, cancelled, and completed.
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
 *           format: date
 *         required: true
 *         description: The start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The end date of the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: A list of cart details categorized by date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2023-10-01"
 *                       count:
 *                         type: integer
 *                         example: 3
 *                       upcoming:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             user:
 *                               type: string
 *                             studio:
 *                               type: string
 *                             slot:
 *                               type: string
 *                             slotTiming:
 *                               type: object
 *                               properties:
 *                                 startTime:
 *                                   type: string
 *                                 endTime:
 *                                   type: string
 *                             equipments:
 *                               type: array
 *                               items:
 *                                 type: object
 *                             paymentStatus:
 *                               type: string
 *                       ongoing:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             user:
 *                               type: string
 *                             studio:
 *                               type: string
 *                             slot:
 *                               type: string
 *                             slotTiming:
 *                               type: object
 *                               properties:
 *                                 startTime:
 *                                   type: string
 *                                 endTime:
 *                                   type: string
 *                             equipments:
 *                               type: array
 *                               items:
 *                                 type: object
 *                             paymentStatus:
 *                               type: string
 *                       cancelled:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             user:
 *                               type: string
 *                             studio:
 *                               type: string
 *                             slot:
 *                               type: string
 *                             slotTiming:
 *                               type: object
 *                               properties:
 *                                 startTime:
 *                                   type: string
 *                                 endTime:
 *                                   type: string
 *                             equipments:
 *                               type: array
 *                               items:
 *                                 type: object
 *                             paymentStatus:
 *                               type: string
 *                       completed:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             user:
 *                               type: string
 *                             studio:
 *                               type: string
 *                             slot:
 *                               type: string
 *                             slotTiming:
 *                               type: object
 *                               properties:
 *                                 startTime:
 *                                   type: string
 *                                 endTime:
 *                                   type: string
 *                             equipments:
 *                               type: array
 *                               items:
 *                                 type: object
 *                             paymentStatus:
 *                               type: string
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "userId, fromDate, and toDate are required"
 *       500:
 *         description: An error occurred while fetching cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching cart details"
 */




router.get('/random-studios',randomStudios)
/**
 * @swagger
 * /api/studio/by-category/{categoryId}:
 *   get:
 *     summary: Retrieve studios by category ID
 *     description: Get a list of studios that belong to a specific category.
 *     tags: [Studios]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: The ID of the studio category
 *         schema:
 *           type: string
 *           example: "64b2c1234f88d839c9e4fabc"
 *     responses:
 *       200:
 *         description: List of studios in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 studios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Studio A"
 *                       studioEmail:
 *                         type: string
 *                         example: "studioa@example.com"
 *                       studioMobileNumber:
 *                         type: string
 *                         example: "+1234567890"
 *                       studioDescription:
 *                         type: string
 *                         example: "A description of Studio A."
 *                       title:
 *                         type: string
 *                         example: "Premium Studio"
 *                       price:
 *                         type: number
 *                         example: 100.0
 *                       image:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       type:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Fitness"
 *                           image:
 *                             type: string
 *                             example: "https://example.com/type-image.jpg"
 *       404:
 *         description: Category or studios not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/by-category/:categoryId',getCategoryStudios)
router.get('/getBookingDetailsByDateRange', getBookingDetailsByDateRange); 
router.get('/:id', getStudioById);
export default router; 
