const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required"});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user);

        res.status(201).json({ message: "User registered", token })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invaid credentials" });
        }

        const token = generateToken(user);
        res.status(200).json({ message: "Login successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// List all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role"});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        const updatedUser = await user.save();

        res.status(200).json({ message: "User role updated", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.remove();
        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};