require("dotenv").config();
const connectToDatabase = require("./src/config/db/connect");

connectToDatabase();
require("./src/app/server");
