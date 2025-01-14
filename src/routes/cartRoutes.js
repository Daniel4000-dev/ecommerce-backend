const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addItemToCart, getCart, updateCartItem, removeCartItem } = require("../controllers/cartController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: ID of the product
 *         quantity:
 *           type: number
 *           description: Quantity of the product
 *       example:
 *         productId: "64f9b05e5c82b010cf40a7e4"
 *         quantity: 2
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added to the cart successfully
 *       401:
 *         description: Not authorized
 */
router.post("/", protect, addItemToCart); // Add item to cart

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all items in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get("/", protect, getCart); // Get user cart

/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authorized
 */
router.put("/", protect, updateCartItem); // Update item quantity

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Item not found
 *       401:
 *         description: Not authorized
 */
router.delete("/:productId", protect, removeCartItem); // Remove item from cart

module.exports = router;