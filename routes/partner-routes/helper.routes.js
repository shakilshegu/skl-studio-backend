import express from "express";
import { 
  getHelpersByPartnerId, 
  addHelperById, 
  updateHelper, 
  deleteHelper 
} from "../../controllers/partner/helper.Controller.js";
import { protect } from "../../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Helpers
 *   description: Helper management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Helper:
 *       type: object
 *       required:
 *         - studioId
 *         - name
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the helper
 *         studioId:
 *           type: string
 *           description: ID of the studio this helper belongs to
 *         name:
 *           type: string
 *           description: Name of the helper
 *         description:
 *           type: string
 *           description: Description of the helper's services
 *         price:
 *           type: number
 *           description: Price for the helper's services
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the helper was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the helper was last updated
 */

/**
 * @swagger
 * /aloka-api/partner/helper:
 *   get:
 *     summary: Get all helpers
 *     tags: [Helpers]
 *     responses:
 *       200:
 *         description: List of all helpers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Helper'
 *       500:
 *         description: Server error
 */
router.get("/",protect, getHelpersByPartnerId);

/**
 * @swagger
 * /aloka-api/partner/helper:
 *   post:
 *     summary: Create a new helper
 *     tags: [Helpers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the helper
 *               description:
 *                 type: string
 *                 description: Description of the helper's services
 *               price:
 *                 type: number
 *                 description: Price for the helper's services
 *     responses:
 *       201:
 *         description: Helper created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Helper'
 *       400:
 *         description: Failed to create helper
 *       404:
 *         description: Studio not found
 */
router.post("/", protect, addHelperById);

/**
 * @swagger
 * /aloka-api/partner/helper/{id}:
 *   put:
 *     summary: Update a helper
 *     tags: [Helpers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the helper to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the helper
 *               description:
 *                 type: string
 *                 description: Description of the helper's services
 *               price:
 *                 type: number
 *                 description: Price for the helper's services
 *     responses:
 *       200:
 *         description: Helper updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Helper'
 *       400:
 *         description: Failed to update helper
 *       404:
 *         description: Helper not found
 */
router.put("/:id", protect, updateHelper);

/**
 * @swagger
 * /aloka-api/partner/helper/{id}:
 *   delete:
 *     summary: Delete a helper
 *     tags: [Helpers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the helper to delete
 *     responses:
 *       200:
 *         description: Helper deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Helper deleted successfully
 *       404:
 *         description: Helper not found
 *       500:
 *         description: Failed to delete helper
 */
router.delete("/:id", protect, deleteHelper);

export default router;