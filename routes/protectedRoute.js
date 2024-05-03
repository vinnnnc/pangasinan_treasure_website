// routes/protectedRoute.js
const express = require("express");
const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // User is authenticated, proceed to the next middleware or route
  }
  res.redirect("/login");
  res.status(401).json({ message: "Unauthorized" });
}

// Protected route
router.get("/protected", isAuthenticated, (req, res) => {
  res.json({ message: "This is a protected route" });
});

// Protected route
router.get("/cart", isAuthenticated, (req, res) => {
  // res.json({ message: "This is a protected route" });
  res.redirect("cart.html");
});

module.exports = router;
