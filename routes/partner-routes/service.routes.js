import express from "express";
import { 
  addServiceById, 
  getServicesByPartnerId, 
  updateService, 
  deleteService,
  getServicesByFilter 
} from "../../controllers/partner/service.Controller.js";
import { protect } from "../../middlewares/auth.js";
import  upload  from "../../middlewares/multer.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Studio service management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - photo
 *         - studioId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the service
 *         name:
 *           type: string
 *           description: Name of the service
 *         price:
 *           type: number
 *           description: Price of the service
 *         description:
 *           type: string
 *           description: Description of the service
 *         photo:
 *           type: string
 *           description: URL of the service photo
 *         studioId:
 *           type: string
 *           description: ID of the studio this service belongs to
 *         isDeleted:
 *           type: boolean
 *           default: false
 *           description: Soft delete flag
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *           description: Array of review objects with ratings
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the service was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the service was last updated
 */

/**
 * @swagger
 * /aloka-api/partner/service:
 *   post:
 *     summary: Add a new service to the logged-in user's studio
 *     tags: [Services]
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
 *               - name
 *               - price
 *               - description
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the service
 *               price:
 *                 type: number
 *                 description: Price of the service
 *               description:
 *                 type: string
 *                 description: Description of the service
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Service image
 *     responses:
 *       200:
 *         description: Service added successfully
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
 *                   example: Service added successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Image is required
 *       404:
 *         description: Studio not found
 *       500:
 *         description: Server error
 */
router.post("/", protect, upload.single("image"), addServiceById);

/**
 * @swagger
 * /aloka-api/partner/service/services-by-partner:
 *   get:
 *     summary: Get all services for the logged-in user's studio
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                   example: Services retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       400:
 *         description: Studio ID is required
 *       404:
 *         description: No services found for this studio
 *       500:
 *         description: Server error
 */
router.get("/services-by-partner", protect, getServicesByPartnerId);

/**
 * @swagger
 * /aloka-api/partner/service/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *                 description: Name of the service
 *               price:
 *                 type: number
 *                 description: Price of the service
 *               description:
 *                 type: string
 *                 description: Description of the service
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Service photo
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                   example: Service updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found or deleted
 *       500:
 *         description: Server error
 */
router.patch("/:id", protect, upload.single("image"), updateService);

/**
 * @swagger
 * /aloka-api/partner/service/{id}:
 *   delete:
 *     summary: Delete a service (soft delete)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
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
 *                   example: Service deleted successfully
 *       404:
 *         description: Service not found or already deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteService);

/**
 * @swagger
 * /aloka-api/partner/service/filter:
 *   get:
 *     summary: Get services by filter criteria
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: ratings
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *     responses:
 *       200:
 *         description: Filtered services retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Filtered services retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid filter parameters
 *       500:
 *         description: Server error
 */
router.get("/filter", getServicesByFilter);

export default router;