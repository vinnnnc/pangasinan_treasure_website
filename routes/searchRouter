// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get filtered list of products
router.get("/", async (req, res) => {
  console.log("Filtering...");
  try {
    let filter = {};

    // Handle category filter (including "notSet" value)
    if (req.query.category && req.query.category !== "notSet") {
      filter.category = req.query.category;
    }

    // Handle shippedFrom filter (including "notSet" value)
    if (req.query.shippedFrom && req.query.shippedFrom !== "notSet") {
      filter.shippedFrom = req.query.shippedFrom;
    }

    // Handle minPrice filter (including "notSet" value)
    if (req.query.minPrice && req.query.minPrice !== "notSet") {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    }

    // Handle maxPrice filter (including "notSet" value)
    if (req.query.maxPrice && req.query.maxPrice !== "notSet") {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }

    // Handle search by name
    if (req.query.productName) {
      filter.name = { $regex: new RegExp(req.query.productName, "i") }; // Case-insensitive search
    }

    // Sort options
    let sortOptions = {};
    if (req.query.sortBy === "lowToHigh") {
      sortOptions.price = 1;
    } else if (req.query.sortBy === "highToLow") {
      sortOptions.price = -1;
    } else if (req.query.sortBy === "ratings") {
      sortOptions.ratings = -1;
    }
    console.log("Filtering...");
    const products = await Product.find(filter).sort(sortOptions);
    console.log(products);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
