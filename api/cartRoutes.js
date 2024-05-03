const app = require("../index");
const route = require("../routes/cartRoutes");

app.use("/api/", route);

module.exports = app;
