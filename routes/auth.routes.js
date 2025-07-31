import express from "express";
import { sendOTPHandler, verifyOTPHandler, login, updateCredentials,userCredentials } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /aloka-api/auth/login:
 *   post:
 *     summary: User login with email/username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's email address used as username
 *               password:
 *                 type: string
 *                 description: User's password
 *               isPartnerLogin:
 *                 type: boolean
 *                 description: Flag indicating if login is for partner account
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                 isBusinessUser:
 *                   type: boolean
 *                 role:
 *                   type: string
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /aloka-api/auth/send-otp:
 *   post:
 *     summary: Send OTP to mobile number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: User's mobile number
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: Failed to send OTP
 *       500:
 *         description: Server error
 */
router.post("/send-otp", sendOTPHandler);

/**
 * @swagger
 * /aloka-api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *               - otpCode
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: User's mobile number
 *               otpCode:
 *                 type: string
 *                 description: OTP received by the user
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: OTP verified successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                 isBusinessUser:
 *                   type: boolean
 *                 role:
 *                   type: string
 *       400:
 *         description: Invalid OTP or missing parameters
 *       404:
 *         description: Mobile number not found
 *       500:
 *         description: Server error
 */
router.post("/verify-otp", verifyOTPHandler);

/**
 * @swagger
 * /aloka-api/auth/update-credentials:
 *   post:
 *     summary: Update user email and password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: New email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password
 *     responses:
 *       200:
 *         description: Credentials updated successfully
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
 *                   example: Credentials updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *       400:
 *         description: Invalid inputs
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post("/update-credentials", protect, updateCredentials);
router.get("/user-credentials", protect, userCredentials);

export default router;