// api/partner/service
import express from 'express';
import upload from "../../middleware/multer.js";
import {
  addServiceByStudioId,
  getAllServices,
  getServicesByStudioId,
  getServiceById,
  getServicesByFilter,
  updateService,
  deleteService
} from "../../controllers/partner/service.Controller.js";
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/partner/service/{studioId}:
 *   post:
 *     summary: Add a new service for a specific studio
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: studioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the studio
 *     requestBody:
 *       required: true
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
 *                 description: Photo of the service
 *     responses:
 *       201:
 *         description: Service added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Studio not found
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.single('image'),protect,addServiceByStudioId);
router.get('/services-by-studioId',protect, getServicesByStudioId);
router.get('/', getAllServices);

/**
 * @swagger
 * /api/partner/service/filterServices:
 *   get:
 *     summary: Get services based on price range and ratings
 *     description: |
 *       This API allows filtering services based on a price range (`minPrice`, `maxPrice`) 
 *       and a minimum rating for reviews (`ratings`). The user can provide one or both 
 *       price filters, and the system will return the services that meet the specified criteria.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: minPrice
 *         in: query
 *         description: The minimum price to filter the services.
 *         required: false
 *         type: number
 *         example: 1000
 *       - name: maxPrice
 *         in: query
 *         description: The maximum price to filter the services.
 *         required: false
 *         type: number
 *         example: 5000
 *       - name: ratings
 *         in: query
 *         description: The minimum rating for the service reviews.
 *         required: false
 *         type: number
 *         example: 4
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered services.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Filtered services retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       serviceName:
 *                         type: string
 *                         example: "Photography Service"
 *                       price:
 *                         type: number
 *                         example: 3000
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rating:
 *                               type: number
 *                               example: 4.5
 *                             user:
 *                               type: string
 *                               example: "Alice"
 *                             comment:
 *                               type: string
 *                               example: "Great service, highly recommended!"
 *       400:
 *         description: |
 *           Invalid price range: minPrice should be less than or equal to maxPrice.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid price range: minPrice should be less than or equal to maxPrice."
 *       500:
 *         description: |
 *           Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error occurred."
 */
router.get('/filterServices', getServicesByFilter);

/**
 * @swagger
 * /api/partner/service/{id}:
 *   get:
 *     summary: Get service details by ID
 *     description: Fetch the details of a specific service by its unique ID. If the service is deleted or does not exist, an appropriate error message will be returned.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the service to fetch.
 *         schema:
 *           type: string
 *           example: "64f5a3d2e5b34b2f3aabcde1"
 *     responses:
 *       200:
 *         description: Successfully retrieved the service details.
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
 *                   example: "Service retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f5a3d2e5b34b2f3aabcde1"
 *                     name:
 *                       type: string
 *                       example: "Premium Cleaning Service"
 *                     price:
 *                       type: number
 *                       example: 1500
 *                     description:
 *                       type: string
 *                       example: "A premium cleaning service for residential and commercial spaces."
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Service not found or deleted.
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
 *                   example: "Service not found or deleted"
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Failed to fetch the service due to a server error.
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
 *                   example: "Failed to fetch service"
 *                 data:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.get('/:id', getServiceById);

/**
 * @swagger
 * /api/partner/service/{id}:
 *   put:
 *     summary: Update a service by its ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the service
 *     requestBody:
 *       required: true
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
 *                 description: Photo of the service
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                     serviceName:
 *                       type: string
 *                     price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     photo:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service ID is required
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service not found
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
router.put('/:id', upload.single('photo'), updateService);

/**
 * @swagger
 * /api/partner/service/{id}:
 *   delete:
 *     summary: Delete a service by its ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the service
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service ID is required
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service not found
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
router.delete('/:id', deleteService);

/**
 * @swagger
 * /api/partner/service/services-by-studioId:
 *   get:
 *     summary: Retrieve a list of services by studio ID
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the studio
 *     responses:
 *       200:
 *         description: A list of services
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       serviceName:
 *                         type: string
 *                       price:
 *                         type: number
 *                       description:
 *                         type: string
 *                       photo:
 *                         type: string
 *                       studioId:
 *                         type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Studio ID is required
 *       404:
 *         description: No services found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No services found for this studio
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


export default router;