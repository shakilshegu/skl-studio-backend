import express from "express";
import {
  addEquipment,
  updateEquipment,
  getEquipmentByFilter,
  getEquipmentsByPartnerId,
  deleteEquipment,
} from "../../controllers/partner/equipment.Controller.js";
import { protect } from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: Equipment management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       required:
 *         - type
 *         - name
 *         - price
 *         - description
 *         - photo
 *         - studioId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the equipment
 *         type:
 *           type: string
 *           description: Category ID of the equipment
 *         name:
 *           type: string
 *           description: Name of the equipment
 *         price:
 *           type: number
 *           description: Price of the equipment
 *         description:
 *           type: string
 *           description: Description of the equipment
 *         photo:
 *           type: string
 *           description: URL of the equipment photo
 *         studioId:
 *           type: string
 *           description: ID of the studio this equipment belongs to
 *         brand:
 *           type: string
 *           description: Brand of the equipment
 *         model:
 *           type: string
 *           description: Model of the equipment
 *         isDeleted:
 *           type: boolean
 *           default: false
 *           description: Soft delete flag
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the equipment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the equipment was last updated
 */

/**
 * @swagger
 * /aloka-api/partner/equipment:
 *   post:
 *     summary: Add new equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - name
 *               - price
 *               - desc
 *               - image
 *             properties:
 *               category:
 *                 type: string
 *                 description: Category ID of the equipment
 *               name:
 *                 type: string
 *                 description: Name of the equipment
 *               price:
 *                 type: number
 *                 description: Price of the equipment
 *               desc:
 *                 type: string
 *                 description: Description of the equipment
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Equipment image
 *     responses:
 *       201:
 *         description: Equipment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Equipment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Image required or Studio not found
 */
router.post("/", protect, upload.single("image"), addEquipment);

/**
 * @swagger
 * /aloka-api/partner/equipment/filter:
 *   get:
 *     summary: Get equipment by filter
 *     tags: [Equipment]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Category ID of the equipment
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
 *         description: Minimum rating of the equipment
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the equipment (partial match)
 *     responses:
 *       200:
 *         description: List of equipment matching filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 *       500:
 *         description: Server error
 */
router.get("/filter", getEquipmentByFilter);

/**
 * @swagger
 * /aloka-api/partner/equipment/equipments-by-partner:
 *   get:
 *     summary: Get all equipment by studio ID of the logged-in user
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of equipment for the user's studio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Equipment'
 *       404:
 *         description: Studio not found
 *       500:
 *         description: Server error
 */
router.get("/equipments-by-partner", protect, getEquipmentsByPartnerId);

/**
 * @swagger
 * /aloka-api/partner/equipment/{id}:
 *   put:
 *     summary: Update equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the equipment to update
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Category ID of the equipment
 *               name:
 *                 type: string
 *                 description: Name of the equipment
 *               price:
 *                 type: number
 *                 description: Price of the equipment
 *               desc:
 *                 type: string
 *                 description: Description of the equipment
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Equipment image
 *     responses:
 *       200:
 *         description: Equipment updated successfully
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
 *                   example: Equipment updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Equipment'
 *       400:
 *         description: Equipment ID is required
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, upload.single("image"), updateEquipment);

/**
 * @swagger
 * /aloka-api/partner/equipment/{id}:
 *   delete:
 *     summary: Delete equipment by ID (soft delete)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the equipment to delete
 *     responses:
 *       200:
 *         description: Equipment deleted successfully
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
 *                   example: Equipment deleted successfully
 *                 data:
 *                   type: null
 *       404:
 *         description: Equipment not found or already deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteEquipment);

export default router;