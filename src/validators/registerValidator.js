const { z } = require("zod");

const registerSchema = z
  .object({
    name: z
      .string({
        required_error: "O campo 'name' é obrigatório",
      })
      .min(3, "o nome é muito curto")
      .max(50, "o nome é muito grande"),

    role: z.enum(["admin", "user"]).default("user"),

    profileImg: z
      .object({
        nameImg: z.string().default(""),
        srcImg: z.string().default(""),
      })
      .default({ nameImg: "", srcImg: "" }),

    descripion: z
      .string()
      .max(150, "A descrição pode ter no máximo 150 caracteres")
      .default(""),

    dateBirth: z.date({
      required_error: "O campo 'dateBirth' é obrigatório",
    }),

    handle: z
      .string({
        required_error: "O campo 'handle' é obrigatório",
      })
      .min(5, "O handle deve ter pelo menos 5 caracteres")
      .max(20, "O handle pode ter no máximo 20 caracteres")
      .regex(
        /^[a-zA-Z0-9_.]+$/,
        "O handle só pode conter letras, números, '_' e '.'"
      )
      .trim(),

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

    confirmPassword: z
      .string({ required_error: "O campo 'confirmPassword' é obrigatório" })
      .min(8, "A confirmação de senha deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

module.exports = registerSchema;
