const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../../../models/userModel/user.model");
const SendEmail = require("../../../services/sendEmail/SendEmail");
const bcrypt = require("bcrypt");
const AuthTokenPassword = require("../../../middlewares/authTokenPassword/AuthTokenPassword");
const { z } = require("zod");
const {
  EmailRecover,
} = require("../../../services/emailCustomized/EmailRecoverPassword");

// rota de enviar token de recuperar senha ao usuario

router.post("/password/token", async (req, res) => {
  const EmailSchema = z.object({
    email: z
      .string({
        required_error: "O campo 'email' é obrigatório",
      })
      .email("Formato de email inválido")
      .trim(),
  });

  try {
    const { email } = EmailSchema.parse(req.body);

    const user = await UserModel.findOne({ email: email }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ msg: "esse email não pertence a nenhum usuario, é inválido" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_RECOVER_PASSWORD,
      { expiresIn: "10m" }
    );

    infoEmail = await SendEmail(
      process.env.EMAIL_SUPPORT,
      email,
      "Token de redefinição de senha",
      EmailRecover("http://localhost:5173/recover-password", token, user.name),
      `Clique no link a seguir para redefinir sua senha: http://localhost:5173/recover-password?token=${token}`
    );

    res.status(200).json({
      msg: `O token foi enviado ao seu endereço ${email}`,
      info: infoEmail,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ msg: error.errors[0].message });
    }

    res.status(500).json({
      msg: "um erro aconteceu no envio do token ao seu email, tente novamente",
    });
  }
});

router.patch("/password", AuthTokenPassword, async (req, res) => {
  const id = req.userId;

  const PasswordCheckSchema = z
    .object({
      password: z
        .string({
          required_error: "O campo 'password' é obrigatório",
        })
        .min(8, "A senha deve ter pelo menos 8 caracteres"),

      confirmPassword: z
        .string({ required_error: "O campo 'confirmPassword' é obrigatório" })
        .min(8, "A confirmação de senha deve ter pelo menos 8 caracteres"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    });

  try {
    const { password } = PasswordCheckSchema.parse(req.body);

    const userWithOldPassword = await UserModel.findById(id);

    if (userWithOldPassword.password === password) {
      return res
        .status(422)
        .json({ msg: "A nova senha nâo pode ser igual a antiga." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await UserModel.findByIdAndUpdate(id, { password: hashPassword });

    res.status(200).json({ msg: "Senha alterada com sucesso!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ msg: error.errors[0].message });
    }

    res.status(500).json({
      msg: "Ocorreu um erro interno na mudança de senha",
    });
  }
});

module.exports = router;
