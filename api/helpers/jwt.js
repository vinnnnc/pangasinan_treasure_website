// authMiddleware.js
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function authJwt(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    res.redirect("/login");
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Invalid token.");
  }
}

module.exports = authJwt;
