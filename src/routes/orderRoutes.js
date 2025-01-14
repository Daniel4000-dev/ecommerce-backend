const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - items
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *         shippingAddress:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             postalCode:
 *               type: string
 *             country:
 *               type: string
 *         paymentMethod:
 *           type: string
 *           description: Payment method (e.g., Card, Pay-on-Delivery)
 *       example:
 *         items:
 *           - productId: "64f9b05e5c82b010cf40a7e4"
 *             quantity: 2
 *         shippingAddress:
 *           address: "123 Main St"
 *           city: "Lagos"
 *           postalCode: "100001"
 *           country: "Nigeria"
 *         paymentMethod: "Card"
 */

// User routes
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order data
 *       401:
 *         description: Not authorized
 */
router.post("/", protect, createOrder); //Create order

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get("/", protect, getUserOrders); // Get user orders

// Admin routes
/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *       403:
 *         description: Forbidden (Not an admin)
 */
router.get("/all", protect, admin, getAllOrders); // Fetch all orders

/**
 * @swagger
 * /orders/{orderId}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the order (e.g., Shipped, Delivered)
 *             example:
 *               status: Shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden (Not an admin)
 */
router.put("/:orderId", protect, admin, updateOrderStatus); // Update order status

module.exports = router;
