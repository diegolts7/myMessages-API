const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string({
      required_error: "O campo 'email' é obrigatório",
    })
    .email("Formato de email inválido")
    .trim(),

  password: z
    .string({
      required_error: "O campo 'password' é obrigatório",
    })
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

module.exports = loginSchema;
