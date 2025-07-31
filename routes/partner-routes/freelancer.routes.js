import express from 'express';
import { protect } from '../../middlewares/auth.js'; 
import upload from "../../middlewares/multer.js";
import { 
  createFreelancer, 
  deleteFreelancer, 
  getFreelancerByUserId, 
  getFreelancerCategories, 
  updateFreelancer 
} from '../../controllers/partner/freelancer.Controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Freelancer
 *   description: Freelancer management routes
 */

/**
 * @swagger
 * /aloka-api/partner/freelancer:
 *   get:
 *     summary: Get freelancer by user ID
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Freelancer found
 *       404:
 *         description: No freelancer found
 */
router.get('/', protect, getFreelancerByUserId);

/**
 * @swagger
 * /aloka-api/partner/freelancer/event-categories:
 *   get:
 *     summary: Get all event categories
 *     tags: [Freelancer]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/event-categories', getFreelancerCategories);

/**
 * @swagger
 * /aloka-api/partner/freelancer:
 *   post:
 *     summary: Create a freelancer profile
 *     tags: [Freelancer]
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
 *               - age
 *               - location
 *               - experience
 *               - pricePerHour
 *               - profileImage
 *               - categories
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               description:
 *                 type: string
 *               categories:
 *                 type: string
 *                 description: JSON string array or single category ID
 *               location:
 *                 type: string
 *               experience:
 *                 type: number
 *               pricePerHour:
 *                 type: number
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Freelancer created
 *       400:
 *         description: Validation error
 */
router.post('/', protect, upload.single('profileImage'), createFreelancer);

/**
 * @swagger
 * /aloka-api/partner/freelancer:
 *   put:
 *     summary: Update a freelancer profile
 *     tags: [Freelancer]
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
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               description:
 *                 type: string
 *               categories:
 *                 type: string
 *                 description: JSON string array or single category ID
 *               location:
 *                 type: string
 *               experience:
 *                 type: number
 *               pricePerHour:
 *                 type: number
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Freelancer updated
 *       404:
 *         description: Freelancer not found
 */
router.put('/', protect, upload.single('profileImage'), updateFreelancer);

/**
 * @swagger
 * /aloka-api/partner/freelancer/{id}:
 *   delete:
 *     summary: Delete a freelancer profile
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Freelancer ID
 *     responses:
 *       200:
 *         description: Freelancer deleted
 *       404:
 *         description: Freelancer not found
 */
router.delete('/:id', protect, deleteFreelancer);

export default router;
