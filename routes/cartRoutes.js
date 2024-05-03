// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user's cart
router.get("/", async (req, res) => {
  try {
    // Assuming you have user authentication middleware that sets req.user
    const userId = req.session.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
});

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // Assuming you have user authentication middleware that sets req.user
    const userId = req.session.user.id;
    console.log(productId, quantity);
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add item to the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
});

// Remove item from cart
router.delete("/remove/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    // Assuming you have user authentication middleware that sets req.user
    const userId = req.session.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((item) => !item._id.equals(itemId));
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
