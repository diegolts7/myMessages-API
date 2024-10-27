require("dotenv").config();
const connectToDatabase = require("./src/config/db/connect");

connectToDatabase();
const app = require("./src/app/server");

app.get("/", (req, res) => {
  res.send("API está funcionando");
});
