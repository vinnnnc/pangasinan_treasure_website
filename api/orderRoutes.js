const app = require("../index");
const route = require("../routes/orderRoutes");

app.use("/api/", route);

module.exports = app;
