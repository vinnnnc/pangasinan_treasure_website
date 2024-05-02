const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const protectedRoute = require("./routes/protectedRoute");
// Import other route files

const app = express();

// Set up Express Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://developerthrill:DZZ7HbyAnp97KVl8@cluster0.l62emu1.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "pangasinantreasure_db",
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Use routes
app.use("/users", userRoutes);
app.use("/protected", protectedRoute);
// Use other routes

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
