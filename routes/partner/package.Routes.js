// api/partner/package

import express from 'express';
import upload from "../../middleware/multer.js";
import { addPackage, getAllPackages, getPackageById, updatePackage, deletePackage, getPackagesByStudioId } from '../../controllers/partner/package.Controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management
 */

/**
 * @swagger
 * /api/partner/package:
 *   post:
 *     summary: Add new package
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Basic Photography Package
 *               price:
 *                 type: number
 *                 example: 100
 *               description:
 *                 type: string
 *                 example: A basic package for photography services
 *               duration:
 *                 type: string
 *                 example: 2 hours
 *               studioId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c83
 *               equipments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c83
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c83
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Package added successfully
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
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     studioId:
 *                       type: string
 *                     equipments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     services:
 *                       type: array
 *                       items:
 *                         type: string
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
 *                   example: Studio ID is required
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

/**
 * @swagger
 * /api/partner/package:
 *   get:
 *     summary: Retrieve all packages for a specific studio
 *     tags: [Packages]
 *     parameters:
 *       - in: query
 *         name: studioId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the studio
 *     responses:
 *       200:
 *         description: A list of packages
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
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       description:
 *                         type: string
 *                       duration:
 *                         type: string
 *                       studioId:
 *                         type: string
 *                       equipments:
 *                         type: array
 *                         items:
 *                           type: string
 *                       services:
 *                         type: array
 *                         items:
 *                           type: string
 *                       photo:
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

/**
 * @swagger
 * /api/partner/package/{id}:
 *   get:
 *     summary: Retrieve a package by its ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the package
 *     responses:
 *       200:
 *         description: Package retrieved successfully
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
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     studioId:
 *                       type: string
 *                     equipments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     services:
 *                       type: array
 *                       items:
 *                         type: string
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
 *                   example: Package ID is required
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Package not found
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

/**
 * @swagger
 * /api/partner/package/{id}:
 *   put:
 *     summary: Update a package by its ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the package
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Basic Photography Package
 *               price:
 *                 type: number
 *                 example: 100
 *               description:
 *                 type: string
 *                 example: A basic package for photography services
 *               duration:
 *                 type: string
 *                 example: 2 hours
 *               studioId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c83
 *               equipments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c83
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c83
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Package updated successfully
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
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     studioId:
 *                       type: string
 *                     equipments:
 *                       type: array
 *                       items:
 *                         type: string
 *                     services:
 *                       type: array
 *                       items:
 *                         type: string
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
 *                   example: Package ID is required
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Package not found
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

/**
 * @swagger
 * /api/partner/package/{id}:
 *   delete:
 *     summary: Delete a package by its ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the package
 *     responses:
 *       200:
 *         description: Package deleted successfully
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
 *                   example: Package ID is required
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Package not found
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

router.post('/', upload.single('image'),protect ,addPackage);
router.get('/',protect ,getPackagesByStudioId);
router.get('/:id', getPackageById);
router.put('/:id', upload.single('photo'), updatePackage);
router.delete('/:id', deletePackage);

export default router;