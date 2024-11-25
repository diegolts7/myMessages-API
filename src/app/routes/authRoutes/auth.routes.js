const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../../models/userModel/user.model");
const Authenticate = require("../../../middlewares/authentication/Authentication");

const router = express.Router();

// rota register

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.trim()) {
    return res.status(422).json({ msg: "preencha seu nome!" });
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

// rota de login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!emailPattern.test(email)) {
    return res.status(422).json({ msg: "preencha o email corretamente" });
  }

  if (!password || password.length < 8) {
    return res.status(422).json({ msg: "preencha sua senha corretamente!" });
  }

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "usuario nao existe, cadastre-se!" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "a senha está incorreta!" });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
        },
      },
      secret
    );
    res.status(200).json({
      msg: "usuario logado com sucesso!",
      token,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "erro interno no servidor, volte mais tarde!" });
  }
});

router.get("/check-acess", Authenticate, async (req, res) => {
  const user = req.user;

  res.status(200).json({ msg: "Voce está logado!", isLoggedIn: true, user });
});

module.exports = router;
