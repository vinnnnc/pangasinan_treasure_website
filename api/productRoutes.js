const app = require("../index");
const route = require("../routes/productRoutes");

app.use("/api/", route);

module.exports = app;
