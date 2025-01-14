const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String },
    stock: { type: Number, required: true },
    images: { 
        type: String, // URL or path to the product image
        required: true, 
    },
  },
  { timestamps: true }
);

// Add indexes
ProductSchema.index({ name: 1 }); // Single field index for name
ProductSchema.index({ price: 1 }); // Single field index for price
ProductSchema.index({ category: 1, stock: -1 }); // Compound index for category and stock

// const products = await Product.find({ category: "Electronics" }).explain();
// console.log(products);

module.exports = mongoose.model("Product", ProductSchema);
