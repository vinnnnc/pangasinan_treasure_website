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

// Route to get total sales and revenue of each seller by name
router.get("/seller/analytics", async (req, res) => {
  console.log("Retrieving seller analytics...");
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0 in JavaScript

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const sellerSalesRevenue = await Seller.aggregate([
      {
        $lookup: {
          from: "orders", // Collection name for orders
          localField: "_id", // Use seller's _id
          foreignField: "sellerId", // Field in orders collection
          as: "orders",
        },
      },
      {
        $unwind: {
          path: "$orders",
          preserveNullAndEmptyArrays: true, // Include sellers without orders
        },
      },
      {
        $unwind: {
          path: "$orders.orderItems",
          preserveNullAndEmptyArrays: true, // Include orders without items
        },
      },
      {
        $match: {
          "orders.dateOrdered": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$name", // Group by seller name
          totalSales: { $sum: { $ifNull: ["$orders.orderItems.quantity", 0] } }, // Calculate total sales
          totalRevenue: { $sum: { $ifNull: ["$orders.totalPrice", 0] } }, // Calculate total revenue
        },
      },
    ]);

    console.log(sellerSalesRevenue);
    res.json(sellerSalesRevenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to collect total daily revenues of all sellers
router.get("/analytics/totalDailyRevenues", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0 in JavaScript

    // Calculate the start and end date of the current month
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Generate an array of days in the current month
    const daysInMonth = Array.from(
      { length: new Date(currentYear, currentMonth, 0).getDate() },
      (_, i) => i + 1
    );

    // Fetch total daily revenues for all orders in the current month
    const dailyRevenues = await Order.aggregate([
      {
        $match: {
          dateOrdered: { $gte: startDate, $lte: endDate },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$dateOrdered" },
          revenue: { $sum: "$totalPrice" }, // Assuming totalPrice field holds the revenue amount
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          revenue: 1,
        },
      },
      { $sort: { day: 1 } }, // Sort by day in ascending order
    ]);

    // Fill in missing days with 0 revenue
    const completeDailyRevenues = daysInMonth.map((day) => {
      const foundDay = dailyRevenues.find((item) => item.day === day);
      return { day, revenue: foundDay ? foundDay.revenue : 0 };
    });

    return res.json({
      year: currentYear,
      month: currentMonth,
      dailyRevenues: completeDailyRevenues,
    });
  } catch (error) {
    console.error("Error collecting total daily revenues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
