const app = require("../index");
const route = require("../routes/protectedRoute");

app.use("/api/", route);

module.exports = app;
