import express from 'express';
import { protect } from '../../middlewares/auth.js';
import upload from '../../middlewares/multer.js';
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from '../../controllers/partner/portfolio.Controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Portfolio management routes
 */

/**
 * @swagger
 * /aloka-api/partner/portfolio:
 *   get:
 *     summary: Get all portfolios of the logged-in partner
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of portfolios
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getPortfolios);

/**
 * @swagger
 * /aloka-api/partner/portfolio:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolio]
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
 *               - title
 *               - category
 *               - location
 *               - description
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Portfolio created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, upload.array('images', 10), createPortfolio);

/**
 * @swagger
 * /aloka-api/partner/portfolio/{id}:
 *   get:
 *     summary: Get a portfolio by ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID
 *     responses:
 *       200:
 *         description: Portfolio found
 *       404:
 *         description: Portfolio not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', protect, getPortfolioById);

/**
 * @swagger
 * /aloka-api/partner/portfolio/{id}:
 *   put:
 *     summary: Update a portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               existingImages:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Portfolio updated
 *       404:
 *         description: Portfolio not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', protect, upload.array('images', 10), updatePortfolio);

/**
 * @swagger
 * /aloka-api/partner/portfolio/{id}:
 *   delete:
 *     summary: Delete a portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID
 *     responses:
 *       200:
 *         description: Portfolio deleted
 *       404:
 *         description: Portfolio not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', protect, deletePortfolio);

export default router;
