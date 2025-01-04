const cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
exports.addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found "});
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            // Check if product already in cart
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quality += quantity;
            } else {
                // Add new item
                cart.items.push({ product: productId, quantity });
            }
        } else {
            // Create new cart
            await Cart.create({
                user: req.user_id,
                items: [{ product: productId, quantity }],
                totalPrice: product.price * quantity,
            });
        }

        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error",  error: error.message });
    }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};