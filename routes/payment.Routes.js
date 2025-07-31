// api/payment

import express from 'express';
import { createOrder, handleOfflinePayment, handleOnlinePayment } from '../controllers/paymentControler.js';

const router = express.Router();

/**
 * @swagger
 * api/payment/create-order:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with Razorpay
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount for the order
 *               currency:
 *                 type: string
 *                 description: Currency for the order
 *               cartId:
 *                 type: string
 *                 description: Cart ID
 *     responses:
 *       200:
 *         description: Order created successfully
 *       500:
 *         description: Error creating order
 */
router.post('/create-order', createOrder);

/**
 * @swagger
 * api/payment/offline-payment:
 *   post:
 *     summary: Handle offline payment
 *     description: Handle offline payment (cash, cheque, QR code)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: Cart ID
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method
 *               receiptNumber:
 *                 type: string
 *                 description: Receipt number
 *     responses:
 *       200:
 *         description: Offline payment handled successfully
 *       500:
 *         description: Error handling offline payment
 */
router.post('/offline-payment', handleOfflinePayment);

/**
 * @swagger
 * api/payment/online-payment:
 *   post:
 *     summary: Handle online payment
 *     description: Handle online payment with Razorpay
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: Cart ID
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID
 *     responses:
 *       200:
 *         description: Online payment handled successfully
 *       500:
 *         description: Error handling online payment
 */
router.post('/online-payment', handleOnlinePayment);

export default router;