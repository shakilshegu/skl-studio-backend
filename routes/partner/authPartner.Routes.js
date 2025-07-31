import express from 'express';


import { protect } from '../../middleware/auth.js';
import { createBusinessProfile } from '../../controllers/partner/businessInfo.Controller.js';
import { sendOTPHandler, verifyOTPHandler } from '../../controllers/authController.js';

const router = express.Router();
/**
 * @swagger
 * /api/partner/auth/sent-otp:
 *   post:
 *     summary: Send OTP to partner's mobile number
 *     tags: [Partner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: The mobile number of the partner to send the OTP to
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The response message indicating OTP was sent successfully
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Bad request, invalid mobile number or other errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message
 *                   example: "Invalid mobile number"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message for server issues
 *                   example: "Internal server error"
 */
router.post('/sent-otp', sendOTPHandler)
/**
 * @swagger
 * /api/partner/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for partner authentication
 *     tags: [Partner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: Partner's mobile number
 *                 example: "1234567890"
 *               otp:
 *                 type: string
 *                 description: OTP entered by the partner
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully, partner is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: "OTP verified successfully"
 *                 isVerified:
 *                   type: boolean
 *                   description: Partner's verification status
 *                   example: true
 *       400:
 *         description: Bad request, invalid OTP or mobile number
 *       500:
 *         description: Server error
 */
router.post('/verify-otp', verifyOTPHandler);

router.post('/create-business',protect,  createBusinessProfile);


export default router;