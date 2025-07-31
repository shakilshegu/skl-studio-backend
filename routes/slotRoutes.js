// api/studio-slots
import express from 'express';
import { modifyCartItem, getCurrentCartDetails, getSlotsByStudioAndDate, bookSlot, getCartDetails, addToCart } from '../controllers/slotController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/studio-slots/getCartDetails:
 *   get:
 *     summary: Get cart details for a user and studio
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *         example: "60d0fe4f5311236168a109ca"
 *       - in: query
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *         example: "60d0fe4f5311236168a109cb"
 *     responses:
 *       200:
 *         description: Successfully fetched cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     studio:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         location:
 *                           type: object
 *                           properties:
 *                             lat:
 *                               type: number
 *                             lng:
 *                               type: number
 *                     equipments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           quantity:
 *                             type: number
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                     packages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                     totalAmount:
 *                       type: number
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.get('/getCartDetails',protect, getCartDetails); // user

router.post('/bookSlots',protect, bookSlot);  // user

/**
 * @swagger
 * /api/studio-slots/modifyCartItem:
 *   post:
 *     summary: Modify an item in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: The ID of the cart
 *                 example: "60d0fe4f5311236168a109ca"
 *               itemId:
 *                 type: string
 *                 description: The ID of the item to add or delete
 *                 example: "60d0fe4f5311236168a109cb"
 *               itemType:
 *                 type: string
 *                 description: The type of the item (equipments, services, packages)
 *                 example: "equipments"
 *               action:
 *                 type: string
 *                 description: The action to perform (add, delete)
 *                 example: "add"
 *               quantity:
 *                 type: number
 *                 description: The quantity of the item (required for adding equipments)
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully modified the cart item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     equipments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           quantity:
 *                             type: number
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                     packages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                     totalAmount:
 *                       type: number
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Internal server error
 */
router.post('/modifyCartItem', modifyCartItem); // user

/**
 * @swagger
 * /api/studio-slots/addToCart:
 *   post:
 *     summary: Add items to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *                 example: "60d0fe4f5311236168a109ca"
 *               studioId:
 *                 type: string
 *                 description: The ID of the studio
 *                 example: "60d0fe4f5311236168a109cb"
 *               equipments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                 description: List of equipment IDs and their quantities
 *                 example: [{ "id": "60d0fe4f5311236168a109cc", "quantity": 2 }]
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                 description: List of service IDs
 *                 example: [{ "id": "60d0fe4f5311236168a109cd" }]
 *               packages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                 description: List of package IDs
 *                 example: [{ "id": "60d0fe4f5311236168a109ce" }]
 *               slotIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of slot IDs
 *                 example: ["60d0fe4f5311236168a109cf"]
 *               hourlySlotIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of hourly slot IDs
 *                 example: ["60d0fe4f5311236168a109d0"]
 *               rateType:
 *                 type: string
 *                 description: The rate type (hourly or daily)
 *                 example: "hourly"
 *     responses:
 *       201:
 *         description: Successfully added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     studio:
 *                       type: string
 *                     equipments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           quantity:
 *                             type: number
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                     packages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                     totalAmount:
 *                       type: number
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.post('/addToCart',protect, addToCart); // user

/**
 * @swagger
 * /api/studio-slots/slotsByStudioAndDate:
 *   get:
 *     summary: Get slots by studio and date or month
 *     tags: [Slots]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The date for which to get slots (YYYY-MM-DD). Required for hourly bookingType.
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The month for which to get slots (YYYY-MM). Required for daily bookingType.
 *       - in: query
 *         name: bookingType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hourly, daily]
 *         description: The booking type (hourly or daily)
 *     responses:
 *       200:
 *         description: Successfully retrieved slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   available:
 *                     type: boolean
 *                   slotBookingPercentage:
 *                     type: number
 *                   slotId:
 *                     type: string
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.get('/slotsByStudioAndDate', getSlotsByStudioAndDate);

/**
 * @swagger
 * /api/studio-slots/cart/{userId}/{studioId}:
 *   get:
 *     summary: Get cart details
 *     description: Retrieve the most recent cart with a pending payment status for a given user and studio.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: studioId
 *         required: true
 *         description: ID of the studio
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: object
 *                   description: Cart details
 *       400:
 *         description: Missing userId or studioId
 *       404:
 *         description: No pending cart found for the given user and studio
 *       500:
 *         description: An error occurred while fetching the cart details
 */
router.get('/cart/:userId/:studioId', getCurrentCartDetails);

export default router;