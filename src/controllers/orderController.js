const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Payment = require("../models/Payment");

// Create a new order
exports.createOrder = async (req, res) => {
    const { items, deliveryAddress, paymentMethod, totalPrice } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items provided" });
    }

    if (!deliveryAddress) {
        return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
        return res.status(400).json({ message: "Payment method is required" });
    }
    try {
        // Calculate total price
        let totalPrice = 0;
        items.forEach(item => {
            totalPrice += item.quantity * item.product.price;
        });

        // Create the order
        const order = await Order.create({
            user: req.user._id,
            items,
            deliveryAddress,
            totalPrice,
            paymentMethod,
            isPaid: false,
            orderStatus: "Pending",
        });

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fecth all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Fetch all order
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["Pending", "Processing", "Delivered", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found "});
        }

        order.orderStatus = status;
        const updatedOrder = await order.save();

        res,status(200),json({ message: "Order status updated", updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};