// models/product.js
const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  variantName: { type: String, required: true },
  stockCount: { type: Number, default: 0 },
  price: { type: Number, required: true },
  image: { type: String },
});

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  review: { type: String },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  category: { type: String },
  variants: [variantSchema],
  ratings: [ratingSchema],
  dateCreated: { type: Date, default: Date.now },
  maxOrder: { type: Number },
  totalSold: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
