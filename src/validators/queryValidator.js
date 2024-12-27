const { z } = require("zod");

const usersMessagesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
});

module.exports = { usersMessagesSchema };
