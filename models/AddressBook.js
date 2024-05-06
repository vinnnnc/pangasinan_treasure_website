const mongoose = require("mongoose");

const addressBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});
const AddressBook = mongoose.model("AddressBook", addressBookSchema);

module.exports = AddressBook;
