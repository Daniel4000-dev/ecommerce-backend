const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
    PaystackPaymentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);