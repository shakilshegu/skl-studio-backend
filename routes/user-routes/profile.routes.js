import express from 'express';
import { protect } from '../../middlewares/auth.js';
import {getUserProfile,updateUserProfile,deleteUser,createProfile} from "../../controllers/user/profile.controller.js";
import upload from '../../middlewares/multer.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserProfile
 *   description: User profile management
 */

/**
 * @swagger
 * /aloka-api/user/profile:
 *   post:
 *     summary: Create a new user profile
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - gender
 *               - dateOfBirth
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               profilePhoto:
 *                 type: string
 *                 description: URL of profile photo (optional)
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Profile already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /aloka-api/user/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched user profile
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /aloka-api/user/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               profilePhoto:
 *                 type: string
 *                 description: URL of profile photo
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /aloka-api/user/profile:
 *   delete:
 *     summary: Delete the authenticated user's profile
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */


router.post("/", protect,upload.single("profilePhoto"), createProfile);
router.get("/", protect, getUserProfile);
router.put("/", protect,upload.single("profilePhoto"), updateUserProfile);
router.delete("/", protect, deleteUser);
export default router;
