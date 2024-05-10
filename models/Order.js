// models/Order.js
const mongoose = require("mongoose");

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
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
