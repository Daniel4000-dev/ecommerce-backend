const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addItemToCart, getCart, updateCartItem, removeCartItem } = require("../controllers/cartController");

const router = express.Router();

router.post("/", protect, addItemToCart); // Add item to cart
router.get("/", protect, getCart); // Get user cart
router.put("/", protect, updateCartItem); // Update item quantity
router.delete("/:productId", protect, removeCartItem); // Remove item from cart

module.exports = router;