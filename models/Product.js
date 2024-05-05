// models/product.js
const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  variantName: { type: String, required: true },
  stockCount: { type: Number, default: 0 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  sale: { type: String },
});

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  review: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "No description." },
    images: [{ type: String }],
    category: { type: String },
    shippedFrom: { type: Number, required: true },
    variants: [variantSchema],
    ratings: [ratingSchema],
    dateCreated: { type: Date, default: Date.now },
    maxOrder: { type: Number, default: 100 },
    totalSold: { type: Number, default: 0 },
  },
  {
    toJSON: { virtuals: true },
  }
);

// Define a virtual property to calculate the average rating
productSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;

  const totalRating = this.ratings.reduce(
    (acc, rating) => acc + rating.rating,
    0
  );
  return totalRating / this.ratings.length;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
