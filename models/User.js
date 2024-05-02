const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AddressBook = require("./AddressBook");
const UserWallet = require("./UserWallet");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  phone: { type: String },
  password: { type: String, required: true },
  address: {
    street: { type: String },
    apartment: { type: String },
    city: { type: String },
    zip: { type: String },
  },
  addressBook: { type: mongoose.Schema.Types.ObjectId, ref: "AddressBook" },
  userWallet: { type: mongoose.Schema.Types.ObjectId, ref: "UserWallet" },
  // other user fields
});

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
