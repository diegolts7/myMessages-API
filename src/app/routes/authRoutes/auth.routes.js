const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../../models/userModel/user.model");
const MessageModel = require("../../../models/messagesModel/messages.model");

const router = express.Router();

// rota register

router.post("/register", async (req, res) => {
  const { name, lastName, email, password, confirmPassword } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.trim()) {
    return res.status(422).json({ msg: "preencha seu nome!" });
  }
  if (!lastName) {
    return res.status(422).json({ msg: "preencha seu sobrenome!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "preencha seu email!" });
  }

  if (!emailPattern.test(email)) {
    return res.status(422).json({ msg: "preencha o email corretamente" });
  }
  if (!password || password.length < 8) {
    return res.status(422).json({ msg: "preencha sua senha corretamente!" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "senhas diferentes" });
  }

  const user = await UserModel.findOne({ email: email });

  if (user) {
    return res.status(422).json({ msg: "usuario com esse email já existe" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    await UserModel.create({
      name,
      lastName,
      email,
      password: passwordHash,
    });
    res.status(201).json({ msg: "usuario cadastrado com sucesso" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "erro interno no servidor, volte mais tarde!" });
  }
});

module.exports = router;
