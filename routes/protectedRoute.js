// protectedRoute.js
const express = require("express");
const router = express.Router();
const authJwt = require("../helpers/jwt");

router.get("/protected", authJwt, (req, res) => {
  res.send("This is a protected route");
});

// Protected route
router.get("/cart", authJwt, (req, res) => {
  // res.json({ message: "This is a protected route" });
  res.redirect("cart.html");
});

module.exports = router;
