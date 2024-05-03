// app.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const protectedRoute = require("./routes/protectedRoute");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();
const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);
app.use("/protected", protectedRoute);
app.use(cors());
app.options("*", cors());

// Database connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "pangasinantreasure_db", // Specify the dbName option
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

// Middleware for JWT authentication
// app.use(authJwt());

// Routes
app.use(`/`, express.static("public")); // Serve static files from the "public" directory
app.use(`${api}/users`, userRoutes);
app.use(`${api}/product`, productRoutes);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/cart`, cartRoutes);
app.use("/", protectedRoute); // Add the protected route middleware

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/product", (req, res) => {
  res.sendFile(__dirname + "/public/product.html");
});
app.get("/profile", (req, res) => {
  res.sendFile(__dirname + "/public/profile.html");
});
app.get("/sellerdashboard", (req, res) => {
  res.sendFile(__dirname + "/public/seller.html");
});
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

// Endpoint to check login status
app.get(`${api}/auth/check`, (req, res) => {
  if (req.session.user) {
    // User is authenticated
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    // User is not authenticated
    res.json({ loggedIn: false });
  }
});

// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
