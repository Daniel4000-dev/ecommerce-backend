const express = require("express");
const {
    initializePayment,
    verifyPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - order
 *         - user
 *         - paymentMethod
 *         - amount
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the payment
 *         order:
 *           type: string
 *           description: ID of the order associated with the payment
 *         user:
 *           type: string
 *           description: ID of the user who made the payment
 *         paymentMethod:
 *           type: string
 *           description: The payment method used (e.g., Card, Pay-on-Delivery)
 *           example: "Card"
 *         amount:
 *           type: number
 *           description: Total amount of the payment
 *           example: 5000
 *         paymentStatus:
 *           type: string
 *           description: Status of the payment (e.g., Pending, Completed, Failed)
 *           example: "Pending"
 *         paystackPaymentId:
 *           type: string
 *           description: ID generated by the payment gateway
 *           example: "pi_1F5e45Jg3heCohx87J"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Payment creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp of the payment
 *       example:
 *         id: "64f9b05e5c82b010cf40a7e4"
 *         order: "64f9b05e5c82b010cf40a7e5"
 *         user: "64f9b05e5c82b010cf40a7e3"
 *         paymentMethod: "Card"
 *         amount: 5000
 *         paymentStatus: "Pending"
 *         paystackPaymentId: "pi_1F5e45Jg3heCohx87J"
 *         createdAt: "2023-11-15T12:34:56.789Z"
 *         updatedAt: "2023-11-15T12:34:56.789Z"
 */

/**
 * @swagger
 * /payments/initialize:
 *   post:
 *     summary: Initialize a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order
 *               email:
 *                 type: string
 *                 description: Customer's email
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *             example:
 *               orderId: "64f9b05e5c82b010cf40a7e4"
 *               email: "johndoe@example.com"
 *               amount: 5000
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 */
router.post("/initialize", protect, initializePayment);

/**
 * @swagger
 * /payments/verify:
 *   get:
 *     summary: Verify a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference to verify
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Bad request
 */
router.get("/verify", verifyPayment);

module.exports = router;
