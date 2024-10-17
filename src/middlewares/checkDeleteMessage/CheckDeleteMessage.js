const MessageModel = require("../../models/messagesModel/messages.model");

async function CheckDeleteMessage(req, res, next) {
  const messageId = req.params.id;
  const { role, id } = req.user;

  const message = await MessageModel.findById(messageId);

  if (!message) {
    return res
      .status(404)
      .json({ msg: "A mensagem não pode ser deletada, pois não existe" });
  }

  if (message.ownerId !== id && role === "user") {
    return res.status(401).json({
      msg: "Somente administradores podem deletar mensagens de outros usuarios!",
    });
  }

  next();
}

module.exports = CheckDeleteMessage;
