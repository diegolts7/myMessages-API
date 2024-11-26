require("dotenv").config();
const connectToDatabase = require("./src/config/db/connect");
const app = require("./src/app/server");

connectToDatabase();

app.get("/", (req, res) => {
  res.send("API está funcionando");
});

module.exports = app;
