const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        image: String,
        images: [String],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        tags: [String],
        stock: { type: Number, default: 20 },
        sales: { type: Number, default: 0 },
    },
    { timestamps: true },
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
