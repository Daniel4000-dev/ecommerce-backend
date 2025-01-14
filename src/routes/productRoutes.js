const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *         image:
 *           type: string
 *           description: URL or path to the product image
 *           example: "https://example.com/images/product1.jpg"
 *       example:
 *         id: "64f9b05e5c82b010cf40a7e4"
 *         name: "Product 1"
 *         price: 49.99
 *         description: "This is a sample product description."
 *         category: "Electronics"
 *         stock: 100
 */

// Public Route
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
 router.get("/", cacheMiddleware, getAllProducts);

 /**
  * @swagger
  * /products/{id}:
  *   get:
  *     summary: Get a product by ID
  *     tags: [Products]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: ID of the product to retrieve
  *     responses:
  *       200:
  *         description: Product retrieved successfully
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Product'
  *       404:
  *         description: Product not found
  */
 router.get("/:id", cacheMiddleware, getProductById);

// Admin Route
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post("/", protect, admin, createProduct); // Create product

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put("/:productId", protect, admin, updateProduct); // Update product

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete("/:productId", protect, admin, deleteProduct); // Delete product

module.exports = router;