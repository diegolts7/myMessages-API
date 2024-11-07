require("dotenv").config();
const connectToDatabase = require("./src/config/db/connect");

connectToDatabase();
require("./src/app/server");

// app.get("/", (req, res) => {
//   res.send("API está funcionando");
// });

//module.exports = app;
