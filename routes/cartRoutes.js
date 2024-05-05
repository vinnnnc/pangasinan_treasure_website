// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

// Get user's cart based on user ID in request body
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log(userId);
    // const userId = await User.findOne({ user: user._id });
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required in the request body." });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the specified user." });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
});

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

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
router.delete("/remove/:userId/:itemId", async (req, res) => {
  const { itemId, userId } = req.params;
  // const { userId } = req.body;
  try {
    // Assuming you have user authentication middleware that sets req.user
    // const userId = req.session.user.id;
    console.log(userId);
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

// Route to modify the quantity of an item in the cart
router.put("/update", async (req, res) => {
  const { userId, itemId, newQuantity } = req.body; // Assuming userId, itemId, and newQuantity are sent in the request body

  try {
    // Find the user's cart based on userId
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the specified user." });
    }
    // Find the item in the cart by itemId
    const cartItem = cart.items.find(
      (item) => item.productId.toString() === itemId._id.toString()
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in the cart." });
    }

    // Update the quantity of the item
    cartItem.quantity = newQuantity;

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Item quantity updated successfully.", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
