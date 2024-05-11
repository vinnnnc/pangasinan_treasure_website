// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Get order by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// Get order by ID and populate productId in orderItems
const User = require("../models/User");

// Get order by ID and populate productId in orderItems
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "orderItems.productId",
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch the user's name based on userId
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Replace userId with user's name in the order object
    const orderWithUserName = {
      ...order.toObject(),
      userName: user.username,
    };
    console.log(orderWithUserName);

    res.json(orderWithUserName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
// router.post("/", async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json(order);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, paymentMethod } = req.body;

    // Group order items by seller
    const itemsBySeller = {};
    for (const orderItem of orderItems) {
      const sellerId = orderItem.productId.seller; // Assuming seller ID is stored in 'seller' field
      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = [];
      }
      itemsBySeller[sellerId].push(orderItem);
    }

    // Calculate totalPrice based on orderItems
    let totalPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found for ID: ${item.productId}` });
      }
      const variantPrice = product.variants[item.variant].price;
      totalPrice += variantPrice * item.quantity;
    }

    // Create and save orders for each seller
    const orders = [];
    for (const sellerId of Object.keys(itemsBySeller)) {
      const order = new Order({
        userId,
        orderItems: itemsBySeller[sellerId],
        shippingAddress,
        paymentMethod,
        totalPrice,
      });
      const savedOrder = await order.save();
      orders.push(savedOrder);

      // Add the order ID to the seller's orders list
      const seller = await Seller.findById(sellerId);
      if (seller) {
        seller.orders.push(savedOrder._id);
        await seller.save();
      }
    }

    res.status(201).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an order
router.patch("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    Object.assign(order, req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.remove();
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get orders by user ID
// router.get("/user/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const orders = await Order.find({ userId });

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: "No orders found for this user" });
//     }

//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Route to get user's orders list with populated fields
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and populate their orders with specific fields
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ userId: user._id }).populate({
      path: "orderItems",
      populate: {
        path: "productId",
        populate: { path: "seller", select: "name" }, // Populate shopName from the referenced seller
      },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

module.exports = router;
