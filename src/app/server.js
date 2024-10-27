const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes/auth.routes");
const messageRoutes = require("./routes/messagesRoutes/messages.routes");
const userRoutes = require("./routes/userRoutes/user.routes");
const imgProfileRoutes = require("./routes/imgProfileRoutes/imgProfile.routes");
const recoverPasswordRoutes = require("./routes/recoverPasswordRoutes/RecoverPassword.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);
app.use("/user", userRoutes);
app.use("/file", imgProfileRoutes);
app.use("/recover", recoverPasswordRoutes);

app.listen(process.env.PORT, () =>
  console.log(`servidor rodando na porta ${process.env.PORT}`)
);

module.exports = app;
