// api/partner/equipment
import express from 'express';
import upload from "../../middleware/multer.js";
import { addEquipment, getEquipmentsByStudioId, getEquipmentByFilter } from '../../controllers/partner/equipment.Controller.js';
import { equipmentCategory } from '../../middleware/validation.middleware.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: API for managing equipment and equipment categories
 */

/**
 * @swagger
 * /api/partner/equipment:
 *   post:
 *     summary: Add new equipment
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c83
 *               name:
 *                 type: string
 *                 example: Canon EOS 5D
 *               brand:
 *                 type: string
 *                 example: Canon
 *               model:
 *                 type: string
 *                 example: 5D Mark IV
 *               description:
 *                 type: string
 *                 example: A high-quality DSLR camera
 *               studioId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c83
 *               photo:
 *                 type: string
 *                 format: binary
 *               price:
 *                 type: number
 *                 example: 1500
 *               currentStock:
 *                 type: number
 *                 example: 10
 *               totalQuantity:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Equipment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     name:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     model:
 *                       type: string
 *                     description:
 *                       type: string
 *                     photo:
 *                       type: string
 *                     studioId:
 *                       type: string
 *                     price:
 *                       type: number
 *                     currentStock:
 *                       type: number
 *                     totalQuantity:
 *                       type: number
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Photo is required
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
router.post('/', upload.single('image'),protect, addEquipment);
/**
 * @swagger
 * /api/partner/equipment/filterEquipment:
 *   get:
 *     summary: Filter equipment based on type, price, and reviews
 *     tags: [Equipment]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type of the equipment (e.g., Camera, Lighting, Sound, etc.)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price of the equipment
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price of the equipment
 *       - in: query
 *         name: ratings
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum average rating for equipment reviews
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial or full name of the equipment (case-insensitive)
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Filtered equipment retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the equipment
 *                       type:
 *                         type: string
 *                         description: Type of the equipment
 *                       name:
 *                         type: string
 *                         description: Name of the equipment
 *                       brand:
 *                         type: string
 *                         description: Brand of the equipment
 *                       model:
 *                         type: string
 *                         description: Model of the equipment
 *                       description:
 *                         type: string
 *                         description: Description of the equipment
 *                       photo:
 *                         type: string
 *                         description: URL or path to the equipment photo
 *                       price:
 *                         type: number
 *                         description: Price of the equipment
 *                       stock:
 *                         type: number
 *                         description: Number of units available in stock
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             user:
 *                               type: string
 *                               description: ID of the user who left the review
 *                             rating:
 *                               type: number
 *                               description: Rating given by the user
 *                             comment:
 *                               type: string
 *                               description: Review comment
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               description: Timestamp of the review
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the equipment was added
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the equipment was last updated
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid query parameters
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
router.get('/filterEquipment', getEquipmentByFilter);
/**
 * @swagger
 * /api/partner/equipment/equipments/{studioId}:
 *   get:
 *     summary: Get all equipment by studio ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the studio
 *     responses:
 *       200:
 *         description: Successfully retrieved equipment by studio ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the equipment
 *                   type:
 *                     type: string
 *                     description: Type of the equipment
 *                   name:
 *                     type: string
 *                     description: Name of the equipment
 *                   brand:
 *                     type: string
 *                     description: Brand of the equipment
 *                   model:
 *                     type: string
 *                     description: Model of the equipment
 *                   description:
 *                     type: string
 *                     description: Description of the equipment
 *                   photo:
 *                     type: string
 *                     description: URL or path to the equipment photo
 *                   price:
 *                     type: number
 *                     description: Price of the equipment
 *                   currentStock:
 *                     type: number
 *                     description: Number of units available in stock
 *                   totalQuantity:
 *                     type: number
 *                     description: Total quantity of the equipment
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           description: ID of the user who left the review
 *                         rating:
 *                           type: number
 *                           description: Rating given by the user
 *                         comment:
 *                           type: string
 *                           description: Review comment
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp of the review
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the equipment was added
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the equipment was last updated
 *       404:
 *         description: Studio not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Studio not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
router.get('/',protect, getEquipmentsByStudioId);


export default router;
