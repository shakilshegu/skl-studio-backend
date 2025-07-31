import express from 'express';
import { getProfileDetails, updateProfileDetails } from '../controllers/profileController.js';
import upload from "../middleware/multer.js"
const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Retrieve user profile details
 *     tags:
 *       - Profile
 *     description: Fetches the profile details of a user based on the provided user ID.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose profile details are being fetched.
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isVerified:
 *                       type: boolean
 *                     profile:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         gender:
 *                           type: string
 *                         dateOfBirth:
 *                           type: string
 *                           format: date
 *                         profilePhoto:
 *                           type: string
 *                           nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Missing or invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

router.get("",getProfileDetails)
/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile details
 *     tags:
 *       - Profile
 *     description: Updates the profile details of a user, including their personal information and profile photo.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user whose profile is being updated.
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               gender:
 *                 type: string
 *                 description: The gender of the user (e.g., male, female, other).
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the user (YYYY-MM-DD).
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: The profile photo of the user.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isVerified:
 *                       type: boolean
 *                     profile:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         gender:
 *                           type: string
 *                         dateOfBirth:
 *                           type: string
 *                           format: date
 *                         profilePhoto:
 *                           type: string
 *                           nullable: true
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Missing or invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

router.put("",upload.single('profilePhoto'),updateProfileDetails)

export default router;