const app = require("../index");
const route = require("../routes/userRoutes");

app.use("/api/", route);

module.exports = app;
