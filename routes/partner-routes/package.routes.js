import express from "express";
import { 
  addPackageById, 
  getPackageById, 
  updatePackage, 
  deletePackage, 
  getPackagesByPartnerId
} from "../../controllers/partner/package.Controller.js";
import { protect } from "../../middlewares/auth.js";
import  upload  from "../../middlewares/multer.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Studio package management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - studioId
 *         - photo
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the package
 *         name:
 *           type: string
 *           description: Name of the package
 *         price:
 *           type: number
 *           description: Price of the package
 *         description:
 *           type: string
 *           description: Description of the package
 *         studioId:
 *           type: string
 *           description: ID of the studio this package belongs to
 *         equipments:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of equipment IDs included in the package
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of service IDs included in the package
 *         photo:
 *           type: string
 *           description: URL of the package photo
 *         duration:
 *           type: number
 *           description: Duration of the package in hours/days
 *         isDeleted:
 *           type: boolean
 *           default: false
 *           description: Soft delete flag
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the package was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the package was last updated
 */

/**
 * @swagger
 * /aloka-api/partner/package:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
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
 *                 description: Name of the package
 *                 example: "Premium Photography Package"
 *               price:
 *                 type: number
 *                 description: Price of the package
 *                 example: 5000
 *               description:
 *                 type: string
 *                 description: Description of the package
 *                 example: "Complete photography package with premium equipment"
 *               equipments:
 *                 type: string
 *                 description: JSON string array of equipment IDs
 *                 example: '["6804738de0f758b2e9e0f8","680473a0e0f758b2e9e0ff"]'
 *               services:
 *                 type: string
 *                 description: JSON string array of service IDs
 *                 example: '["6804735a0e0f758b2e9e6a","680473a0e0f758b2e9e0ff"]'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Package image
 *     responses:
 *       201:
 *         description: Package created successfully
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
 *                   example: Package added successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       400:
 *         description: Bad request - Image is required or invalid data
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
 *                   example: Photo is required.
 *       404:
 *         description: Studio not found
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
 *                   example: Studio not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error adding package
 */
router.post("/", protect, upload.single("image"), addPackageById);

/**
 * @swagger
 * /aloka-api/partner/package:
 *   get:
 *     summary: Get all packages for the logged-in user's studio
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
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
 *                   example: Packages retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *       404:
 *         description: Studio not found or no packages found
 *       500:
 *         description: Server error
 */
router.get("/", protect, getPackagesByPartnerId);

/**
 * @swagger
 * /aloka-api/partner/package/{id}:
 *   get:
 *     summary: Get a package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package retrieved successfully
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
 *                   example: Package retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getPackageById);

/**
 * @swagger
 * /aloka-api/partner/package/{id}:
 *   put:
 *     summary: Update a package
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the package
 *               price:
 *                 type: number
 *                 description: Price of the package
 *               description:
 *                 type: string
 *                 description: Description of the package
 *               duration:
 *                 type: number
 *                 description: Duration of the package
 *               equipments:
 *                 type: string
 *                 description: JSON string array of equipment IDs
 *               services:
 *                 type: string
 *                 description: JSON string array of service IDs
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Package image
 *     responses:
 *       200:
 *         description: Package updated successfully
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
 *                   example: Package updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, upload.single("image"), updatePackage);

/**
 * @swagger
 * /aloka-api/partner/package/{id}:
 *   delete:
 *     summary: Delete a package (soft delete)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted successfully
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
 *                   example: Package deleted successfully.
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deletePackage);

export default router;