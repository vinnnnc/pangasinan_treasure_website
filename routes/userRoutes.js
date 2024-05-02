const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const AddressBook = require("../models/AddressBook");
const UserWallet = require("../models/UserWallet");

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Set user session
    req.session.user = { id: user._id, email: user.email }; // Store relevant user data in the session

    // Passwords match, user is authenticated
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (for admin)
router.get("/list", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user
router.patch("/:id", async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    Object.assign(user, req.body);

    // Update address book if provided in the request
    if (addressBook) {
      const existingAddressBook = await AddressBook.findById(user.addressBook);
      if (!existingAddressBook) {
        return res.status(404).json({ message: "Address book not found" });
      }

      // Update address book details
      Object.assign(existingAddressBook, addressBook);
      await existingAddressBook.save();
    }

    // Update user's address
    user.address = address;

    // Update user's default address in the address book (if addressBook exists)
    const addressBook = await AddressBook.findOne({
      user: user._id,
      isDefault: true,
    });
    if (addressBook) {
      addressBook.name = user.username;
      addressBook.address =
        address.street +
        ", " +
        address.apartment +
        ", " +
        address.city +
        ", " +
        address.zip;
      await addressBook.save();
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an address in the address book
router.post("/:userId/address", async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = new AddressBook({ name, phone, address });
    await newAddress.save();

    user.addressBook = newAddress._id;
    await user.save();

    res.status(201).json(newAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user's address book
router.get("/:userId/address", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("addressBook");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.addressBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a user wallet
router.post("/:userId/wallet", async (req, res) => {
  try {
    const { balance, transactions } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newWallet = new UserWallet({ balance, transactions });
    await newWallet.save();

    user.userWallet = newWallet._id;
    await user.save();

    res.status(201).json(newWallet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user's wallet
router.get("/:userId/wallet", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("userWallet");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.userWallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
