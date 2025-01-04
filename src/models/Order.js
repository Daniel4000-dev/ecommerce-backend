const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requuired: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                requierd: true,
            },
        },
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    deliveryAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        enum: ["Card", "Pay-on-Delivery"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    totalPrice: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);