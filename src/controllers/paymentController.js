const axios = require("axios");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// Initialize Payment
exports.initializePayment = async (req, res) => {
    const { orderId, email, amount } = req.body;
    
    if (!orderId || !email || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Check if the order exists
        const order = await Order.findById(orderId).populate("user", "email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const existingPayment = await Payment.finOne({ order: orderId, paymentStatus: "Pending" });
        if (existingPayment) {
            return res.status(400).json({ message: "A pending payment already exists for this order" });
        }

        // Lock the order to prevent overlapping payments
        if (order.isLocked) {
            return res.status(400).json({ message: "Order is already being processed" });
        }
        order.isLocked = true;
        await order.save();

        // Generate a unique reference
        const uniqueReference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

        // Initialize Paystack transaction
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email: email || order.user.email,
                amount: amount * 100, // Convert to smallest currency unit
                reference: uniqueReference,
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        if (response.data.status) {
            // Save payment details
            const payment = await Payment.create({
                order: orderId,
                user: order.user._id,
                paymentMethod: "Card",
                amount,
                paystackPaymentId: uniqueReference,
                paymentStatus: "Pending",
            });

            res.status(200).json({
                message: "Payment initialized successfully",
                authorizationUrl: response.data.data.authorization_url,
                payment,
            });
        } else {
            // Unlock the order if initialization fails
            order.isLocked = false;
            await order.save();

            res.status(400).json({ message: "Payment initialization failed" });
        }
    } catch (error) {
        // Unlock the order in case of an error
        const order = await Order.findById(orderId);
        if (order) {
            order.isLocked = false;
            await order.save();
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    const { reference } = req.query;

    if (!reference) {
        return res.status(400).json({ message: "Payment reference is required" });
    }

    try {
        // Retry mechanism for transient failures
        let retries = 0;
        let paymentVerified = false;
        let response;

        while (retries < 3 && !paymentVerified) {
            try {
        response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK__SECRET_KEY}`,
                },
            },
        );
        paymentVerified = response.data.status && response.data.data.status === "success";
            } catch (error) {
                retries++;
            }
        }

        if (paymentVerified) {
            // Find and update the payment record
            const payment = await Payment.findOne({ paystackPaymentId: reference });
            if (!payment) {
                return res.status(404).json({ message: "Payment record not found" });
            }
            payment.paymentStatus = "Completed";
            await payment.save();

            // Find and update the associated order
            const order = await Order.findById(payment.order);

            if (order) {
                return res.status(404).json({ message: "Associated order not found" });
            }

            order.isPaid = true;
            order.isLocked = false;
            await order.save();
            
            res.status(200).json({
                message: "Payment verified successfully",
                payment,
                order,
            });
        } else {
            // Unlock the order on verification failure
            const payment = await Payment.findOne({ paystackPaymentId: reference });
            if (payment) {
                const order = await Order.findById(payment.order);
                if (order) {
                    order.isLocked = false;
                    await order.save();
                }
            }
            
            res.status(400).json({ message: "Payment verification failed "});
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};