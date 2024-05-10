// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Seller = require("../models/Seller");
const Cart = require("../models/Cart");
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

// Get all products for a specific seller
router.get("/:userId/products", async (req, res) => {
  const { userId } = req.params; // Extract sellerId from request parameters
  try {
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    console.log("Getting product list of " + seller.name);

    // Use populate with path to get full product objects
    const populatedProducts = await Seller.populate(seller, {
      path: "products",
      model: "Product", // Assuming "Product" is the name of your product model
    });

    const products = populatedProducts.products;

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    console.log("Done!");

    res.json(products); // Send the products as JSON response
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
router.post(
  "/",
  upload.fields([
    { name: "productGallery", maxCount: 5 },
    { name: "variantImages1", maxCount: 1 },
    { name: "variantImages2", maxCount: 1 },
    { name: "variantImages3", maxCount: 1 },
    { name: "variantImages4", maxCount: 1 },
    { name: "variantImages5", maxCount: 1 },
    { name: "variantImages6", maxCount: 1 },
    { name: "variantImages7", maxCount: 1 },
    { name: "variantImages8", maxCount: 1 },
    { name: "variantImages9", maxCount: 1 },
    { name: "variantImages10", maxCount: 1 },
    { name: "variantImages11", maxCount: 1 },
    { name: "variantImages12", maxCount: 1 },
    { name: "variantImages13", maxCount: 1 },
    { name: "variantImages14", maxCount: 1 },
    { name: "variantImages15", maxCount: 1 },
    { name: "variantImages16", maxCount: 1 },
    { name: "variantImages17", maxCount: 1 },
    { name: "variantImages18", maxCount: 1 },
    { name: "variantImages19", maxCount: 1 },
    { name: "variantImages20", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        userId,
        productName,
        productCategory,
        productDescription,
        productMaxorder,
        productSeller,
        variants,
      } = req.body;

      const productGallery = req.files["productGallery"].map((file) => {
        // Remove the "public" folder from the file path
        const filePathWithoutPublic = file.path.replace(/^public[\\\/]/, "");
        return filePathWithoutPublic;
      });

      const parsedVariants = JSON.parse(variants); // Parse the JSON string to an array

      const updatedVariants = parsedVariants.map((variant, index) => {
        const variantImageFile = req.files[`variantImages${index + 1}`]
          ? req.files[`variantImages${index + 1}`][0]
          : null; // Get variant image file

        let image = null; // Initialize image variable

        if (variantImageFile && variantImageFile.path) {
          image = variantImageFile.path.replace(/^public[\\\/]/, ""); // Get variant image URL
        }

        return { ...variant, image }; // Include variant image in each variant object
      });

      console.log(productGallery);
      console.log(updatedVariants);

      // Create the product
      const product = new Product({
        name: productName,
        category: productCategory,
        description: productDescription,
        images: productGallery,
        seller: productSeller,
        maxOrder: productMaxorder,
        variants: updatedVariants, // Parse the JSON string to an array
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
  }
);

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
    const productId = req.params.id;

    // Find all carts that contain the product
    const carts = await Cart.find({ "items.productId": productId });

    // Update each cart to remove the product from items array
    await Promise.all(
      carts.map(async (cart) => {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
        await cart.save();
      })
    );

    // Delete the product
    await Product.deleteOne({ _id: productId });

    res.json({ message: "Product and associated cart items deleted" });
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
