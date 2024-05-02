// models/UserWallet.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["debit", "credit"], required: true },
  amount: { type: Number, required: true },
  status: { type: String },
  detail: { type: String },
});

const userWalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  transactions: [transactionSchema],
});

const UserWallet = mongoose.model("UserWallet", userWalletSchema);

module.exports = UserWallet;
