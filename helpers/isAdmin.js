// isAdminMiddleware.js
const User = require("../models/User"); // Import your User model

async function isAdmin(req, res, next) {
  try {
    const userId = req.user.userId; // Assuming the user ID is stored in the req.user object
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send("User not found.");
    }
    if (!user.isadmin) {
      return res.redirect("/");
      //   return res.status(403).send("Access denied. User is not an admin.");
    }
    console.log("User is admin");
    // If user is an admin, continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
}

module.exports = isAdmin;
