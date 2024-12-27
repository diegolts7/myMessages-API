const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../../models/userModel/user.model");
const Authenticate = require("../../../middlewares/authentication/Authentication");
const { z } = require("zod");
const registerSchema = require("../../../validators/registerValidator");
const loginSchema = require("../../../validators/loginValidator");
const CheckEmailHandle = require("../../../services/pipelines/CheckEmailHandle");

const router = express.Router();

// rota register

router.post("/register", async (req, res) => {
  const data = req.body;
  data.dateBirth = new Date(data.dateBirth);

  try {
    const { name, email, handle, dateBirth, password } =
      registerSchema.parse(data);

    const [{ emailExists, handleExists }] = await UserModel.aggregate(
      CheckEmailHandle(email, handle)
    ).exec();

    if (emailExists) {
      return res.status(422).json({ msg: "usuario com esse email já existe" });
    }

    if (handleExists) {
      return res
        .status(422)
        .json({ msg: "usuario com esse identificador de usuário já existe" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await UserModel.create({
      name,
      email,
      handle,
      dateBirth,
      password: passwordHash,
    });
    res.status(201).json({ msg: "usuario cadastrado com sucesso" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({ msg: err.errors[0].message });
    }
    res
      .status(500)
      .json({ msg: "erro interno no servidor, volte mais tarde!", err });
  }
});

// rota de login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "usuario nao existe, cadastre-se!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ msg: "a senha está incorreta!" });
    }

    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.SECRET
    );
    res.status(200).json({
      msg: "usuario logado com sucesso!",
      token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({ msg: err.errors[0].message });
    }
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
