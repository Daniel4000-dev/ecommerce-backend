const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         name: "John Doe"
 *         email: "johndoe@example.com"
 *         password: "password123"
 */

// Public Routes
/**
 * @swagger
 * /users/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *        description: User registered successfully
 *      400:
 *        description: Validation error
 */
router.post("/register", registerUser); // Register new user

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: Login a user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Login successful
 *      401:
 *        description: Invalid credentials
 */
router.post("/login", loginUser); // Login user

// Protected Routes
/**
 * @swagger
 * /users/profile:
 *  get:
 *    summary: Get the profile of the logged-in user
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Profile retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/User'
 *      401:
 *        description: Not authorized
 */
router.get("/profile", protect, getUserProfile); // Get user Profile

/**
 * @swagger
 * /users/profile:
 *  put:
 *    summary: Update the profile of the logged-in user
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Profile updated successfully
 *      400:
 *        description: Validation error
 *      401:
 *        description: Not authorized
 */
router.put("/profile", protect, updateUserProfile); // Update user Profile

// Admin Routes
/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get a list of all users (Admin only)
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of users retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: arrray
 *              items:
 *                $ref: '#/components/schemas/User'
 *      403:
 *        description: Forbidden (Not an admin)
 */
router.get("/", protect, admin, getAllUsers); // List all users
 /**
  * @swagger
  * /users/role:
  *   put:
  *     summary: Update the role of a user (Admin only)
  *     tags: [Users]
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - userId
  *               - role
  *             properties:
  *               userId:
  *                 type: string
  *                 description: ID of the user
  *               role:
  *                 type: string
  *                 enum: [user, admin]
  *                 description: New role for the user
  *             example:
  *               userId: 64f9b05e5c82b010cf40a7e4
  *               role: admin
  *     responses:
  *       200:
  *         description: User role updated successfully
  *       404:
  *         description: User not found
  *       403:
  *         description: Forbidden (Not an admin)
  */
router.put("/role", protect, admin, updateUserRole); // Update user role

/**
 * @swagger
 * /users/{userId}:
 *  delete:
 *    summary: Delete a user (Admin only)
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the user to delete
 *    responses:
 *      200:
 *        descripiton: User deleted successfully
 *      404:
 *        description: User not found
 *      403:
 *        description: Forbidden (Not an admin)
 */
router.delete("/:userId", protect, admin, deleteUser); // Delete user

module.exports = router;