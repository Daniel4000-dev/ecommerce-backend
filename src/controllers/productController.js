const Product = require("../models/Product");

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: "Product created", product});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        if (!product) {
            return res.status(404).json({ message: "Product not found"});
        }
        res.status(200).json({ message: "Product updated", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndRemove(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};