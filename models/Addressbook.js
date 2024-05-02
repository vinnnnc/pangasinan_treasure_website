// models/AddressBook.js
const mongoose = require("mongoose");

const addressBookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const AddressBook = mongoose.model("AddressBook", addressBookSchema);

module.exports = AddressBook;
