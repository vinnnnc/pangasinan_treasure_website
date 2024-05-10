// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./helpers/error-handler");
// const authJwt = require("./helpers/jwt");
const app = express();
const api = process.env.API_URL;

// Middleware
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(errorHandler);

// Serve static files
app.use(`/`, express.static("public")); // Serve static files from the "public" directory
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/product", (req, res) => {
  res.sendFile(__dirname + "/public/product.html");
});
app.get("/search", (req, res) => {
  res.sendFile(__dirname + "/public/search.html");
});
app.get("/profile", (req, res) => {
  res.sendFile(__dirname + "/public/profile.html");
});
app.get("/seller/dashboard", (req, res) => {
  res.sendFile(__dirname + "/public/seller.html");
});
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/public/about.html");
});
app.get("/cart", (req, res) => {
  res.sendFile(__dirname + "/public/cart.html");
});
app.get("/seller-registration", (req, res) => {
  res.sendFile(__dirname + "/public/sellerregistration.html");
});
app.get("/seller/dashboard/:id", (req, res) => {
  res.redirect("/seller/dashboard");
});

// Routes
app.use(`${api}/users`, require("./routes/userRoutes"));
app.use(`${api}/product`, require("./routes/productRoutes"));
app.use(`${api}/orders`, require("./routes/orderRoutes"));
app.use(`${api}/cart`, require("./routes/cartRoutes"));
app.use(`${api}/seller`, require("./routes/sellerRoutes"));
app.use(`${api}/result`, require("./routes/searchRouter"));
app.use("/", require("./routes/protectedRoute"));

// Database connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "pangasinantreasure_db", // Specify the dbName option
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// export default app;
// module.exports = app;
