import express from 'express';
import {adminRegister , adminLogin , approveAdmin , changeAdminRoleToUser } from '../controllers/userController.js'
import { verifyAdminToken  , checkRole } from '../middleware/auth.js';

const router = express.Router();

// router.post('/register', adminRegister);
router.post('/login', adminLogin);


/**
 * @swagger
 * api/admin/changeRoleAsAdmin:
 *   post:
 *     summary: Change the role of a user to admin
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: string
 *                 description: The ID of the user to be promoted to admin
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: Admin approved and role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin approved and role updated successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post('/changeRoleAsAdmin', verifyAdminToken, checkRole(['super-admin']), approveAdmin);

/**
 * @swagger
 * api/admin/deleteAdmin:
 *   delete:
 *     summary: Change the role of an admin to user
 *     tags: [Super Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: string
 *                 description: The ID of the admin to be demoted to user
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: Admin role changed to user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin role changed to user successfully
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.delete('/deleteAdmin', verifyAdminToken, checkRole(['super-admin']), changeAdminRoleToUser);



export default router;