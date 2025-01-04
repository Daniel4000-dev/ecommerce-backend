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

// Public Routes
router.post("/register", registerUser); // Register new user
router.post("/login", loginUser); // Login user

// Protected Routes
router.get("/profile", protect, getUserProfile); // Get user Profile
router.put("/profile", protect, updateUserProfile); // Update user Profile

// Admin Routes
router.get("/", protect, admin, getAllUsers); // List all users
router.put("/role", protect, admin, updateUserRole); // Update user role
router.delete("/:userId", protect, admin, deleteUser); // Delete user

module.exports = router;