const mongoose = require("mongoose");
const UserWallet = require("./UserWallet");
// const AddressBook = require("./AddressBook");

const addressBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  isDefault: { type: Boolean, default: true },
});

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "/assets/images/default-avatar.png" },
  // address: {
  //   street: { type: String },
  //   apartment: { type: String },
  //   city: { type: String },
  //   zip: { type: String },
  // },
  addressbook: [addressBookSchema],
  userWallet: { type: mongoose.Schema.Types.ObjectId, ref: "UserWallet" },
  isadmin: { type: Boolean, default: false },
  // other user fields
});

const User = mongoose.model("User", userSchema);

module.exports = User;
