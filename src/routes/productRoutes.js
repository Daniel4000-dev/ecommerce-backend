const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, admin, createProduct); // Create product
router.put("/:productId", protect, admin, updateProduct); // Update product
router.delete("/:productId", protect, admin, deleteProduct); // Delete product

module.exports = router;