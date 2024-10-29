const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../../../models/userModel/user.model");
const SendEmail = require("../../../services/sendEmail/SendEmail");
const bcrypt = require("bcrypt");
const AuthTokenPassword = require("../../../middlewares/authTokenPassword/AuthTokenPassword");

// rota de enviar token de recuperar senha ao usuario

router.post("/password/token", async (req, res) => {
  const { email } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return res.status(400).json({ msg: "o email é obrigátorio!" });
  }
  if (!emailPattern.test(email)) {
    return res.status(400).json({ msg: "envie um email valido!" });
  }

  const user = await UserModel.findOne({ email: email }).select("-password");

  if (!user) {
    return res
      .status(404)
      .json({ msg: "esse email não pertence a nenhum usuario, é inválido" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.SECRET_RECOVER_PASSWORD,
    { expiresIn: "1h" }
  );

  try {
    infoEmail = await SendEmail(
      `Support my messages <${process.env.EMAIL_SUPPORT}>`,
      email,
      "Token de redefinição de senha",
      `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #4CAF50;
                }
                p {
                    font-size: 16px;
                }
                a.button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                a.button:hover {
                    background-color: #45a049;
                }
                footer {
                    margin-top: 20px;
                    font-size: 14px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Recuperação de Senha</h1>
                <p>Olá, ${token}</p>
                <p>Recebemos um pedido para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
                <a href="" class="button">Redefinir Senha</a>
                <p>Se você não fez esse pedido, pode ignorar este e-mail.</p>
                <footer>
                    <p>Atenciosamente,<br>Sua equipe</p>
                </footer>
            </div>
        </body>
        </html>`,
      "Clique no link a seguir para redefinir sua senha: http://seu-site.com/redefinir-senha?token=" +
        token
    );
    res.status(200).json({
      msg: `O token foi enviado ao seu endereço ${email}`,
      info: infoEmail,
    });
  } catch (error) {
    res.status(500).json({
      msg: "um erro aconteceu no envio do token ao seu email, tente novamente",
    });
    console.log(error);
    console.log(error.response.body);
  }
});

router.patch("/password", AuthTokenPassword, async (req, res) => {
  const id = req.userId;
  const { password, confirmPassword } = req.body;

  if (!password && password.length < 8) {
    return res.status(400).json({ msg: "informe uma senha válida" });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({ msg: "As senhas não são iguais!" });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const userModified = await UserModel.findByIdAndUpdate(
      id,
      { password: hashPassword },
      { new: true }
    ).select("-password");
    res
      .status(200)
      .json({ msg: "Senha alterada com sucesso!", user: userModified });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro interno na mudança de senha",
    });
  }
});

module.exports = router;
