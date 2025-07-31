import express from "express";
import { getEventCategories } from "../../controllers/user/home.controller.js";
import { getAllPackages } from "../../controllers/admin/package.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Home
 *     description: User-facing endpoints for event categories and packages
 */

/**
 * @swagger
 * /aloka-api/user/home:
 *   get:
 *     summary: Get event categories with pagination and optional search
 *     tags: [Home]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for category name
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       500:
 *         description: Failed to fetch studio categories
 */

/**
 * @swagger
 * /aloka-api/user/home/packages:
 *   get:
 *     summary: Get all available packages
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Packages fetched successfully
 *       500:
 *         description: Internal server error
 */


router.get("/", getEventCategories);
router.get("/packages",getAllPackages)

export default router;
