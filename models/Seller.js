const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  storeWallet: {
    type: Number,
    default: 0,
  },
  storeLogo: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  dateJoined: { type: Date, default: Date.now },
});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
