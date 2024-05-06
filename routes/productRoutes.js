// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Seller = require("../models/Seller");
const upload = require("../helpers/multerConfig");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Create a new product
// router.post("/", async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).json(product);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Create a new product with file uploads
router.post("/", upload.array("productGallery", 5), async (req, res) => {
  try {
    const {
      userId,
      productName,
      productCategory,
      productDescription,
      variants,
    } = req.body;

    const productGallery = req.files.map((file) => {
      // Remove the "public" folder from the file path
      const filePathWithoutPublic = file.path.replace(/^public[\\\/]/, "");
      return filePathWithoutPublic;
    });

    console.log(productGallery);

    // Create the product
    const product = new Product({
      name: productName,
      category: productCategory,
      description: productDescription,
      images: productGallery,
      variants: JSON.parse(variants), // Parse the JSON string to an array
    });

    // Find the seller by user ID
    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Save the product
    await product.save();

    // Add the product ID to the seller's products array
    seller.products.push(product._id);
    await seller.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.remove();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add rating to a product
router.post("/:id/ratings", async (req, res) => {
  const { userId, rating, review } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add the rating to the product's ratings array
    product.ratings.push({ userId, rating, review });
    await product.save();

    res.status(201).json(product.ratings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all ratings for a product
router.get("/:id/ratings", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product.ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
