// api/dashboard

import express from 'express';
import { getDashboardMetrics , getAllStudiosList , getRevenue , approveStudio , getOrderCount, getOrdersList  , getAllStudiosDetailsWithCounts, getAllStudiosByVerificationStatus } from '../controllers/adminController/dashboardController.js';
import { approveAdmin } from '../controllers/userController.js';

const router = express.Router();


/**
 * @swagger
 * api/dashboard/metrics:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 100000
 *                 totalStudios:
 *                   type: number
 *                   example: 50
 *                 totalCities:
 *                   type: number
 *                   example: 10
 *                 totalCustomers:
 *                   type: number
 *                   example: 200
 *       500:
 *         description: Error fetching dashboard metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching dashboard metrics
 */
router.get('/metrics', getDashboardMetrics);

/**
 * @swagger
 * api/dashboard/studios:
 *   get:
 *     summary: Get list of studios with pagination
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of studios per page
 *     responses:
 *       200:
 *         description: List of studios retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudios:
 *                   type: number
 *                   example: 50
 *                 totalPages:
 *                   type: number
 *                   example: 5
 *                 currentPage:
 *                   type: number
 *                   example: 2
 *                 studios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
 *                       name:
 *                         type: string
 *                         example: Studio One
 *                       description:
 *                         type: string
 *                         example: A great studio
 *                       location:
 *                         type: object
 *                         properties:
 *                           flat:
 *                             type: string
 *                             example: 101
 *                           addressOne:
 *                             type: string
 *                             example: Main Street
 *                           addressTwo:
 *                             type: string
 *                             example: Near Park
 *                           city:
 *                             type: string
 *                             example: New York
 *                           state:
 *                             type: string
 *                             example: NY
 *                           area:
 *                             type: string
 *                             example: Manhattan
 *                           pinCode:
 *                             type: string
 *                             example: 10001
 *                           country:
 *                             type: string
 *                             example: USA
 *                           coordinates:
 *                             type: object
 *                             properties:
 *                               lat:
 *                                 type: number
 *                                 example: 40.7128
 *                               lng:
 *                                 type: number
 *                                 example: -74.0060
 *                       equipments:
 *                         type: array
 *                         items:
 *                           type: string
 *                       title:
 *                         type: string
 *                         example: Best Studio
 *                       price:
 *                         type: number
 *                         example: 100
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         example: 2021-06-21T12:34:56.789Z
 *                       updatedAt:
 *                         type: string
 *                         example: 2021-06-21T12:34:56.789Z
 *       500:
 *         description: Error fetching studios list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching studios list
 */
router.get('/studios', getAllStudiosList );  // Get list of studios with pagination 

/**
 * @swagger
 * api/dashboard/revenue:
 *   get:
 *     summary: Get revenue data
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year for which to calculate revenue
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: The month for which to calculate daily revenue (1-12)
 *     responses:
 *       200:
 *         description: Revenue data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: integer
 *                     description: The day of the month or the month of the year
 *                     example: 1
 *                   totalRevenue:
 *                     type: number
 *                     description: The total revenue
 *                     example: 1000
 *       400:
 *         description: Year query parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Year query parameter is required
 *       500:
 *         description: Error fetching revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching revenue
 */
router.get('/revenue', getRevenue);  // Get revenue

/**
 * @swagger
 * api/dashboard/orders:
 *   get:
 *     summary: Get order count data
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year for which to calculate order count
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: The month for which to calculate daily order count (1-12)
 *     responses:
 *       200:
 *         description: Order count data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: integer
 *                     description: The day of the month or the month of the year
 *                     example: 1
 *                   orderCount:
 *                     type: integer
 *                     description: The total number of orders
 *                     example: 10
 *       400:
 *         description: Year query parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Year query parameter is required
 *       500:
 *         description: Error fetching order count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching order count
 */
router.get('/orders', getOrderCount);  // Get orders


/**
 * @swagger
 * api/dashboard/orders-list:
 *   get:
 *     summary: Get orders list
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The number of orders per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term for user name, email, or mobile
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: false
 *         description: The city to filter orders by studio location
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: The start date for the date range filter (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: The end date for the date range filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Orders list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: integer
 *                   description: The total number of orders
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                   example: 2
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The order ID
 *                         example: "60d0fe4f5311236168a109ca"
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The user's name
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             description: The user's email
 *                             example: "john.doe@example.com"
 *                           mobile:
 *                             type: string
 *                             description: The user's mobile number
 *                             example: "+1234567890"
 *                       studio:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The studio's name
 *                             example: "Studio One"
 *                           address:
 *                             type: object
 *                             properties:
 *                               city:
 *                                 type: string
 *                                 description: The studio's city
 *                                 example: "New York"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: The date of the order
 *                         example: "2023-01-15T12:34:56.789Z"
 *                       totalAmount:
 *                         type: number
 *                         description: The total amount of the order
 *                         example: 1000
 *                       status:
 *                         type: string
 *                         description: The status of the order
 *                         example: "confirmed"
 *       500:
 *         description: Error fetching orders list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching orders list
 */

router.get('/orders-list', getOrdersList);  // Get orders-list    


/**
 * @swagger
 * /approve-admin:
 *   post:
 *     summary: Approve admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully approved admin
 *       500:
 *         description: Internal server error
 */
router.post('/approve-admin', approveAdmin);  // Approve admin

/**
 * @swagger
 * /studios-details:
 *   get:
 *     summary: Get all studios details with counts
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved studios details with counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studio:
 *                     type: object
 *                     properties:
 *                       name: { type: string }
 *                       description: { type: string }
 *                       location: { type: object }
 *                       equipments: { type: array }
 *                       services: { type: array }
 *                       packages: { type: array }
 *                       title: { type: string }
 *                       price: { type: object }
 *                       type: { type: string }
 *                       isVerified: { type: boolean }
 *                       isDeleted: { type: boolean }
 *                       isComplete: { type: boolean }
 *                       createdAt: { type: string }
 *                       updatedAt: { type: string }
 *                       facilities: { type: array }
 *                       reviews: { type: array }
 *                       images: { type: array }
 *                       videos: { type: string }
 *                   counts:
 *                     type: object
 *                     properties:
 *                       ordersCount: { type: number }
 *                       equipmentCount: { type: number }
 *                       packagesCount: { type: number }
 *                       servicesCount: { type: number }
 *                       averageRating: { type: number }
 *       500:
 *         description: Internal server error
 */
router.get('/studios-details', getAllStudiosDetailsWithCounts);  // Get all studios details with counts

/**
 * @swagger
 * /approve-studio:
 *   post:
 *     summary: Approve a studio
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
 *                 description: The ID of the studio to approve
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Studio approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 studio:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *       400:
 *         description: studioId is required
 *       404:
 *         description: Studio not found
 *       500:
 *         description: An error occurred while approving the studio
 */


router.post('/approve-studio', approveStudio);  // Approve Studio


/**
 * @swagger
 * /api/dashboard/studiosByVerificationStatus/{isVerified}:
 *   get:
 *     summary: Get all studios by verification status with pagination and search
 *     tags: [Studios]
 *     parameters:
 *       - in: path
 *         name: isVerified
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: true
 *         description: Verification status of the studios
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of studios per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term for name, email, and mobile number
 *     responses:
 *       200:
 *         description: Studios fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalStudios:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 studios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       studioEmail:
 *                         type: string
 *                       studioMobileNumber:
 *                         type: string
 *                       gstNumber:
 *                         type: string
 *                       address:
 *                         type: object
 *                         properties:
 *                           addressLineOne:
 *                             type: string
 *                           addressLineTwo:
 *                             type: string
 *                           city:
 *                             type: string
 *                           state:
 *                             type: string
 *                           pinCode:
 *                             type: string
 *                           country:
 *                             type: string
 *                       location:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                           lng:
 *                             type: number
 *                       studioDescription:
 *                         type: string
 *                       owner:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           ownerEmail:
 *                             type: string
 *                           ownerMobileNumber:
 *                             type: string
 *                           gender:
 *                             type: string
 *                           dateOfBirth:
 *                             type: string
 *                             format: date
 *                       title:
 *                         type: string
 *                       price:
 *                         type: object
 *                         properties:
 *                           perHour:
 *                             type: number
 *                           perDay:
 *                             type: number
 *                       type:
 *                         type: string
 *                       isVerified:
 *                         type: boolean
 *                       isDeleted:
 *                         type: boolean
 *                       isComplete:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       facilities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       partner:
 *                         type: string
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                       videos:
 *                         type: string
 *       400:
 *         description: isVerified parameter is required
 *       500:
 *         description: An error occurred while fetching studios
 */

// SAMPLE REQUEST :  studiosByVerificationStatus/true?page=1&limit=10&search=John
router.get('/studiosByVerificationStatus/:isVerified', getAllStudiosByVerificationStatus);


export default router;