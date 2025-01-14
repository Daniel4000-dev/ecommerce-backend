const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Defaults: page 1, 10 items per page
    
    try {
        const products = await Product.find()
            .limit(parseInt(limit)) // Limit the number of results
            .skip((parseInt(page) - 1) * parseInt(limit)) // Skip previous pages
            .sort({ name: 1 }); // Optional: sort alphabetically
        
        const total = await Product.countDocuments(); // Total product count

        res.status(200).json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select("name price description category stock image"); // Fecth product by ID
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
}
// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: "Product created", product});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

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