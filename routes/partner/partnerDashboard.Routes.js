//  api/partner-dashboard
import express from 'express';
import { getStudioDetailsByUserId, getRevenueAndOrderCountByUserId, getStudioStatsByUserId } from '../../controllers/partner/partner.Controller.js';
import { accessPermissionStudioOwner } from '../../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/partner-dashboard/studioById:
 *   get:
 *     summary: Get studio details by user ID
 *     tags: [Partner-Dashboard]
 *     
 *     responses:
 *       200:
 *         description: Studio details retrieved successfully
 *       400:
 *         description: userId is required
 *       404:
 *         description: Studio not found
 *       500:
 *         description: An error occurred while fetching studio details
 */
router.get('/studioById', accessPermissionStudioOwner ,   getStudioDetailsByUserId);

/**
 * @swagger
 * /api/partner-dashboard/revenue-and-order-count:
 *   get:
 *     summary: Get revenue and order count by user ID
 *     tags: [Partner-Dashboard]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *         description: The month for which to get the revenue and order count
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year for which to get the revenue and order count
 *     responses:
 *       200:
 *         description: Revenue and order count retrieved successfully
 *       400:
 *         description: userId and year are required
 *       404:
 *         description: Studio not found
 *       500:
 *         description: An error occurred while fetching revenue and order count
 */
router.get('/revenue-and-order-count', accessPermissionStudioOwner , getRevenueAndOrderCountByUserId);

/**
 * @swagger
 * /api/partner-dashboard/partnerStats:
 *   get:
 *     summary: Get studio stats by user ID
 *     tags: [Partner-Dashboard]
 *     
 *      
 *     responses:
 *       200:
 *         description: Studio stats retrieved successfully
 *       400:
 *         description: userId is required
 *       404:
 *         description: Studio not found
 *       500:
 *         description: An error occurred while fetching studio stats
 */
router.get('/partnerStats', accessPermissionStudioOwner , getStudioStatsByUserId);

export default router;
