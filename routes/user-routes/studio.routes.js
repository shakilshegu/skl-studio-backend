import express from 'express';
import { protect } from '../../middlewares/auth.js';
import {
  fetchAllStudio,
  fetchEquipmentsByStudioId,
  fetchHelpersByStudioId,
  fetchPackagesByStudioId,
  fetchServicesByStudioId,
  fetchStudioById,
  getPartnerAvailability
} from '../../controllers/user/studio.controller.js';

const router = express.Router();

/**
 * @swagger
 * /aloka-api/user/studio:
 *   get:
 *     summary: Get all active studios
 *     description: Fetch all studios that are not marked as deleted.
 *     tags:
 *       - Studio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of active studios
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
 *                     $ref: '#/components/schemas/Studio'
 *       404:
 *         description: No studios found
 *       500:
 *         description: Server error
 */
router.get('/', fetchAllStudio);

/**
 * @swagger
 * /aloka-api/user/studio/{id}:
 *   get:
 *     summary: Get a specific studio by ID
 *     description: Fetch details of a studio by its unique ID if it is not marked as deleted.
 *     tags:
 *       - Studio
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the studio to fetch
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A studio object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 studio:
 *                   $ref: '#/components/schemas/Studio'
 *       404:
 *         description: Studio not found
 *       500:
 *         description: Server error
 */
router.get('/:id', fetchStudioById);

/**
 * @swagger
 * /aloka-api/user/studio/{studioId}/availability:
 *   get:
 *     summary: Get studio availability
 *     description: Fetch availability data for a specific studio within an optional date range
 *     tags:
 *       - Studio Availability
 *     parameters:
 *       - name: studioId
 *         in: path
 *         required: true
 *         description: The ID of the studio
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         required: false
 *         description: Start date for availability range (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         required: false
 *         description: End date for availability range (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Studio availability data
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
 *                     $ref: '#/components/schemas/Availability'
 *       500:
 *         description: Server error
 */
router.get('/:studioId/availability', getPartnerAvailability);

/**
 * @swagger
 * /aloka-api/user/studio/{studioId}/equipments:
 *   get:
 *     summary: Get all equipment for a studio
 *     description: Fetch all active equipment items associated with a specific studio
 *     tags:
 *       - Studio Resources
 *     parameters:
 *       - name: studioId
 *         in: path
 *         required: true
 *         description: The ID of the studio
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of equipment items for the studio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 equipments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Equipment'
 *       500:
 *         description: Server error
 */
router.get('/:studioId/equipments', fetchEquipmentsByStudioId);

/**
 * @swagger
 * /aloka-api/user/studio/{studioId}/packages:
 *   get:
 *     summary: Get all packages for a studio
 *     description: Fetch all active booking packages associated with a specific studio
 *     tags:
 *       - Studio Resources
 *     parameters:
 *       - name: studioId
 *         in: path
 *         required: true
 *         description: The ID of the studio
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of packages for the studio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 packages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *       500:
 *         description: Server error
 */
router.get('/:studioId/packages', fetchPackagesByStudioId);

/**
 * @swagger
 * /aloka-api/user/studio/{studioId}/services:
 *   get:
 *     summary: Get all services for a studio
 *     description: Fetch all active services associated with a specific studio
 *     tags:
 *       - Studio Resources
 *     parameters:
 *       - name: studioId
 *         in: path
 *         required: true
 *         description: The ID of the studio
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services for the studio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get('/:studioId/services', fetchServicesByStudioId);

/**
 * @swagger
 * /aloka-api/user/studio/{studioId}/helpers:
 *   get:
 *     summary: Get all helpers for a studio
 *     description: Fetch all active assistants/helpers associated with a specific studio
 *     tags:
 *       - Studio Resources
 *     parameters:
 *       - name: studioId
 *         in: path
 *         required: true
 *         description: The ID of the studio
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of helpers for the studio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 helpers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Helper'
 *       500:
 *         description: Server error
 */
router.get('/:studioId/helpers', fetchHelpersByStudioId);

/**
 * @swagger
 * components:
 *   schemas:
 *     Studio:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the studio
 *         studioName:
 *           type: string
 *           description: The name of the studio
 *         studioEmail:
 *           type: string
 *           description: The email address of the studio
 *         description:
 *           type: string
 *           description: Detailed description of the studio
 *         location:
 *           type: string
 *           description: The physical location of the studio
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to studio photos
 *         contactNumber:
 *           type: string
 *           description: Contact phone number for the studio
 *         isDeleted:
 *           type: boolean
 *           description: Whether the studio is active or deleted
 *         user:
 *           type: string
 *           description: Reference to the User who owns this studio
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         studioName: Skylight Studios
 *         studioEmail: contact@skylightstudios.com
 *         description: A professional photography studio with state-of-the-art equipment
 *         location: Manhattan, New York
 *         photos: ["https://example.com/studio1.jpg", "https://example.com/studio2.jpg"]
 *         contactNumber: "+1 212-555-1234"
 *         isDeleted: false
 *         user: 60d21b4667d0d8992e610c80
 *     
 *     Availability:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the availability record
 *         partnerId:
 *           type: string
 *           description: Reference to the studio or freelancer
 *         date:
 *           type: string
 *           format: date
 *           description: The date of availability
 *         timeSlots:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               isBooked:
 *                 type: boolean
 *       example:
 *         _id: 60d21b4667d0d8992e610c90
 *         partnerId: 60d21b4667d0d8992e610c85
 *         date: "2025-05-15T00:00:00.000Z"
 *         timeSlots: [
 *           {
 *             startTime: "09:00",
 *             endTime: "12:00",
 *             isBooked: false
 *           },
 *           {
 *             startTime: "13:00",
 *             endTime: "17:00",
 *             isBooked: true
 *           }
 *         ]
 *     
 *     Equipment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *           description: Reference to equipment category
 *         name:
 *           type: string
 *           description: Name of the equipment
 *         description:
 *           type: string
 *           description: Detailed description of the equipment
 *         photo:
 *           type: string
 *           description: Image of the equipment
 *         price:
 *           type: number
 *           description: Rental price of the equipment
 *         isDeleted:
 *           type: boolean
 *           description: Whether the equipment is available for booking
 *         studioId:
 *           type: string
 *           description: Reference to the studio that owns this equipment
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *       example:
 *         _id: 60d21b4667d0d8992e610c86
 *         type: 60d21b4667d0d8992e610c90
 *         name: Canon EOS 5D Mark IV
 *         description: Professional DSLR camera with 30.4MP full-frame sensor
 *         photo: https://example.com/camera.jpg
 *         price: 150
 *         isDeleted: false
 *         studioId: 60d21b4667d0d8992e610c85
 *         reviews: [
 *           {
 *             user: 60d21b4667d0d8992e610c82,
 *             rating: 5,
 *             comment: "Equipment was in perfect condition",
 *             createdAt: "2023-05-10T10:30:00Z"
 *           }
 *         ]
 *     
 *     Package:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Name of the package
 *         description:
 *           type: string
 *           description: Detailed description of what's included in the package
 *         price:
 *           type: number
 *           description: Total price for the package
 *         photo:
 *           type: string
 *           description: Featured image for the package
 *         isDeleted:
 *           type: boolean
 *           description: Whether the package is available for booking
 *         studioId:
 *           type: string
 *           description: Reference to the studio offering this package
 *         equipments:
 *           type: array
 *           description: Equipment included in this package
 *           items:
 *             type: string
 *         services:
 *           type: array
 *           description: Services included in this package
 *           items:
 *             type: string
 *       example:
 *         _id: 60d21b4667d0d8992e610c87
 *         name: Studio Full Day Package
 *         description: Full day studio rental with basic lighting equipment
 *         price: 800
 *         photo: https://example.com/package.jpg
 *         isDeleted: false
 *         studioId: 60d21b4667d0d8992e610c85
 *         equipments: ["60d21b4667d0d8992e610c86"]
 *         services: ["60d21b4667d0d8992e610c88"]
 *     
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Name of the service
 *         description:
 *           type: string
 *           description: Detailed description of the service
 *         price:
 *           type: number
 *           description: Price of the service
 *         photo:
 *           type: string
 *           description: Image representing the service
 *         isDeleted:
 *           type: boolean
 *           description: Whether the service is available for booking
 *         studioId:
 *           type: string
 *           description: Reference to the studio offering this service
 *       example:
 *         _id: 60d21b4667d0d8992e610c88
 *         name: Lighting Setup
 *         description: Professional lighting setup for your photoshoot
 *         price: 200
 *         photo: https://example.com/service.jpg
 *         isDeleted: false
 *         studioId: 60d21b4667d0d8992e610c85
 *     
 *     Helper:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Name of the assistant
 *         description:
 *           type: string
 *           description: Assistant's role and qualifications
 *         price:
 *           type: number
 *           description: Hourly rate for the assistant
 *         isDeleted:
 *           type: boolean
 *           description: Whether the helper is available for booking
 *         studioId:
 *           type: string
 *           description: Reference to the studio that works with this assistant
 *       example:
 *         _id: 60d21b4667d0d8992e610c89
 *         name: Lighting Assistant
 *         description: Experienced lighting technician for studio photography
 *         price: 50
 *         isDeleted: false
 *         studioId: 60d21b4667d0d8992e610c85
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;