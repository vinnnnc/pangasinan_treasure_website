// models/Order.js
const mongoose = require("mongoose");
// models/Order.js
const Product = require("./Product");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: { type: Number },
  quantity: { type: Number },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [orderItemSchema],
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Pending" },
  totalPrice: { type: Number, required: true },
  dateOrdered: { type: Date, default: Date.now },
  orderNumber: {
    type: Number,
    unique: true,
  },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
});

// Define pre-save middleware to populate sellerId based on productId
orderSchema.pre("save", async function (next) {
  try {
    // const Order = mongoose.model("Order", orderSchema); // Get the Order model
    const order = this;

    // Iterate through orderItems and get the sellerId from the productId
    for (const orderItem of order.orderItems) {
      const product = await Product.findById(orderItem.productId);
      if (!product) {
        throw new Error("Product not found");
      }
      order.sellerId = product.seller; // Assuming sellerId is stored in the 'seller' field of Product
    }

    next(); // Proceed to save the order
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Define pre-save middleware for Order schema
orderSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.status === "Delivered") {
    try {
      // Iterate through orderItems to update totalSold for each product
      for (const orderItem of this.orderItems) {
        const product = await Product.findById(orderItem.productId);
        if (product) {
          product.totalSold += orderItem.quantity;
          await product.save();
        }
      }
    } catch (error) {
      console.error("Error updating totalSold:", error);
      // Handle error as needed
    }
  }
  next();
});

orderSchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      let orderNumber = "";
      for (let i = 0; i < 18; i++) {
        const digit = Math.floor(Math.random() * 10); // Generate a random digit (0-9)
        orderNumber += digit.toString(); // Append the digit to the order number string
      }
      // const timestamp = new Date().getTime(); // Get current timestamp
      // const randomNumber = Math.floor(Math.random() * 1000000); // Generate random number
      // const userPrefix = this.userId.toString().slice(0, 4); // Take the first 4 characters of the userId

      // Concatenate all parts to create the order number
      this.orderNumber = `${orderNumber}`;

      // Ensure the order number has a specific length by padding with zeros if needed
      // const maxLength = 18; // Adjust this value as needed
      // if (this.orderNumber.length < maxLength) {
      //   this.orderNumber = this.orderNumber.padEnd(maxLength, "0");
      // }
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
