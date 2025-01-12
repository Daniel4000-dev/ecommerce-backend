const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Placeholder Routes
app.get("/", (req, res) => res.send("API is running..."));

// Routes
const baseUrl = "/api"; // Define the base URL
app.use(`${baseUrl}/users`, userRoutes);
app.use(`${baseUrl}/product`, productRoutes);
app.use(`${baseUrl}/cart`, cartRoutes);
app.use(`${baseUrl}/orders`, orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));