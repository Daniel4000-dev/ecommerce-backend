const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

// User routes
router.post("/", protect, createOrder); //Create order
router.get("/", protect, getUserOrders); // Get user orders

// Admin routes
router.get("/all", protect, admin, getAllOrders); // Fetch all orders
router.put("/:orderId", protect, admin, updateOrderStatus); // Update order status

module.exports = router;
