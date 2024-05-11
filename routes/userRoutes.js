const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const UserWallet = require("../models/UserWallet");
const AddressBook = require("../models/AddressBook");
const Seller = require("../models/Seller");

// Route to get user details by ID
router.get("/list/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Exclude sensitive fields like password before sending the response
    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new user
router.post("/register", async (req, res) => {
  const {
    fullname,
    username,
    phone,
    email,
    birthdate,
    address,
    gender,
    password,
    avatar,
  } = req.body;
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already registered" });
    }

    // Check if the email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const addressBookEntry = {
      name: fullname,
      phone,
      address,
      isDefault: true,
    };

    // Create the user
    const newUser = new User({
      fullname,
      username,
      phone,
      email,
      birthdate,
      address,
      gender,
      password: hashedPassword,
      avatar,
      addressbook: addressBookEntry,
    });

    // newUser.addressBook.push(addressBookEntry);

    await newUser.save();
    // const addressBookEntry = new AddressBook({
    //   userId: newUser._id, // Reference to the user
    //   fullname,
    //   phone,
    //   address,
    //   isDefault: true, // Set as default address
    // });
    // await addressBookEntry.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const secret = process.env.JWT_SECRET;
  try {
    // Find the user by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isadmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    // Send the token and user email in the response
    console.log(user.fullname + " logged in");
    res
      .status(200)
      .json({ userId: user._id, token: token, isAdmin: user.isadmin });
  } catch (err) {
    // console.error(err);
    console.log("Internal server error");
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users (for admin)
router.get("/list", async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user
router.patch("/list/:id", async (req, res) => {
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
router.delete("/list/:id", async (req, res) => {
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
      console.log(user);
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
  w;
});

// Middleware to get seller by ID
async function getSeller(req, res, next) {
  try {
    const userId = req.params.id;

    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      res.seller = null; // Set seller to null if not found
      res.isRegisteredSeller = false; // Flag indicating user is not a registered seller
      return next(); // Move to the next middleware or route handler
    }
    res.seller = seller; // Set seller object if found
    res.isRegisteredSeller = true; // Flag indicating user is a registered seller
    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Route to check if user is registered as a seller
router.get("/:id/isRegisteredSeller", getSeller, (req, res) => {
  if (!res.isRegisteredSeller) {
    console.log("User is not registered as seller!");
    return res.redirect("/seller-registration"); // Redirect to seller registration page
  }
  res.json({ isRegisteredSeller: true });
});

module.exports = router;
