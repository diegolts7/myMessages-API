const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes/auth.routes");
const messageRoutes = require("./routes/messagesRoutes/messages.routes");
const userRoutes = require("./routes/userRoutes/user.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT, () =>
  console.log(`servidor rodando na porta ${process.env.PORT}`)
);
