import express from 'express';
import { protect } from '../../middlewares/auth.js';
import {
  addStudioHandler,
  fetchStudioByPartnerId,
  fetchStudioById,
  updateStudioHandler,
  deleteStudioHandler,
} from '../../controllers/partner/studio.Controller.js';
import upload from '../../middlewares/multer.js';

const router = express.Router();

/**
 * @swagger
 * /aloka-api/partner/studio:
 *   get:
 *     summary: Get all studios by the current partner
 *     tags: [Studio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of studios
 */
router.get('/', protect, fetchStudioByPartnerId);

/**
 * @swagger
 * /aloka-api/partner/studio/{id}:
 *   get:
 *     summary: Get a studio by its ID
 *     tags: [Studio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Studio ID
 *     responses:
 *       200:
 *         description: Studio fetched successfully
 *       404:
 *         description: Studio not found
 */
router.get('/:id', protect, fetchStudioById);

/**
 * @swagger
 * /aloka-api/partner/studio:
 *   post:
 *     summary: Create a new studio
 *     tags: [Studio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               studioName:
 *                 type: string
 *               studioEmail:
 *                 type: string
 *               studioMobileNumber:
 *                 type: string
 *               studioStartedDate:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               addressLineOne:
 *                 type: string
 *               addressLineTwo:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pinCode:
 *                 type: string
 *               country:
 *                 type: string
 *               lat:
 *                 type: string
 *               lng:
 *                 type: string
 *               studioDescription:
 *                 type: string
 *               studioType:
 *                 type: string
 *               studioLogo:
 *                 type: string
 *                 format: binary
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Studio created successfully
 *       400:
 *         description: User already has a studio
 */
router.post('/', protect,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "studioLogo", maxCount: 1 }
  ]),
  addStudioHandler);

/**
 * @swagger
 * /aloka-api/partner/studio/{id}:
 *   put:
 *     summary: Update a studio by ID
 *     tags: [Studio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Studio ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudio'
 *     responses:
 *       200:
 *         description: Studio updated successfully
 */
router.put('/:id', protect, updateStudioHandler);

/**
 * @swagger
 * /aloka-api/partner/studio/{id}:
 *   delete:
 *     summary: Soft delete a studio by ID
 *     tags: [Studio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Studio deleted successfully
 */
router.delete('/:id', protect, deleteStudioHandler);

export default router;
