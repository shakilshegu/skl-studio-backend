// api/auth
import express from 'express';
import { sendOTPHandler, verifyOTPHandler, updateCredentials, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';



const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User Login
 *     description: API for user and partner authentication
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     tags:
 *       - User Login
 *     summary: Send an OTP to a mobile number
 *     description: Generates and sends a 4-digit OTP to the provided mobile number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: The mobile number to send OTP to.
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
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
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Error sending OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Error message"
 */

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     tags:
 *       - User Login
 *     summary: Verify the OTP
 *     description: Verifies the OTP entered by the user for the provided mobile number and checks if it has expired.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: The mobile number to verify OTP for.
 *                 example: "+1234567890"
 *               otpCode:
 *                 type: string
 *                 description: The OTP code entered by the user.
 *                 example: "1234"
 *               role:
 *                 type: string
 *                 description: The role of the user (e.g., user or partner).
 *                 example: "partner"
 *                 enum:
 *                   - user
 *                   - partner
 *     responses:
 *       200:
 *         description: OTP verified successfully.
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
 *                   example: "OTP verified successfully"
 *                 token:
 *                   type: string
 *                   description: The JWT token for authenticated user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZGZkZmRiLTgwZjMtNGQ0Ny1hYmYzLWZkZjYwNDE5MTA5YSIsIm1vYmlsZSI6Ii"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "12345abcde"
 *                     mobile:
 *                       type: string
 *                       example: "+1234567890"
 *       400:
 *         description: Invalid, expired OTP, or missing parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Invalid or expired OTP"
 *       404:
 *         description: Mobile number not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Mobile number not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "OTP verification failed"
 */

router.post('/login', login);
router.post('/send-otp', sendOTPHandler);
router.post('/verify-otp', verifyOTPHandler);

router.post(
    '/update-credentials',
    protect,
    updateCredentials
  );

export default router;
