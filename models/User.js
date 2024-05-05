const mongoose = require("mongoose");
const AddressBook = require("./AddressBook");
const UserWallet = require("./UserWallet");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  birthdate: { type: Date },
  address: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  password: { type: String, required: true },
  avatar: { type: String, default: "/assets/images/default-avatar.png" },
  // address: {
  //   street: { type: String },
  //   apartment: { type: String },
  //   city: { type: String },
  //   zip: { type: String },
  // },
  addressBook: { type: mongoose.Schema.Types.ObjectId, ref: "AddressBook" },
  userWallet: { type: mongoose.Schema.Types.ObjectId, ref: "UserWallet" },
  // other user fields
});

const User = mongoose.model("User", userSchema);

module.exports = User;
