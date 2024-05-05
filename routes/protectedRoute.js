// protectedRoute.js
const express = require("express");
const router = express.Router();
const authJwt = require("../helpers/jwt");

router.get("/protected", authJwt, (req, res) => {
  res.send("This is a protected route");
});
router.get("/cartAuth", authJwt, (req, res) => {
  res.send({ Success: true });
});

module.exports = router;
