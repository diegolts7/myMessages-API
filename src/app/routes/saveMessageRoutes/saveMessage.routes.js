const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const { default: mongoose } = require("mongoose");
const PipelineMessageUser = require("../../../services/pipelines/PipelineMessageUser");
const PipelineUsersInfoMessage = require("../../../services/pipelines/PipelineUsersInfoMessage");

const router = express.Router();

router.patch("/save/:id", Authentication, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { id } = req.user;
    const modifiedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { $addToSet: { saves: id } },
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "mensagem salva com sucesso", message: modifiedMessage });
  } catch (error) {
    res.status(500).json({ msg: "erro ao salvar a mensagem" });
  }
});

router.patch("/discard/:id", Authentication, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { id } = req.user;
    const modifiedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { $pull: { saves: id } },
      { new: true }
    );
    res.status(200).json({
      msg: "mensagem descartada dos seus salvos com sucesso",
      message: modifiedMessage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "erro ao descartar a mensagem dos seus salvos" });
  }
});

router.get("/users/:messageId", Authentication, async (req, res) => {
  const messageId = req.params.messageId;
  const idUserAuth = req.user.id;

  try {
    const result = await MessageModel.aggregate(
      PipelineUsersInfoMessage(messageId, "saves", idUserAuth)
    ).exec();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao buscar os usuarios que salvaram a mensagem." });
  }
});

router.get("/:userId", Authentication, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const id = req.user.id;

  try {
    const result = await MessageModel.aggregate(
      PipelineMessageUser({ saves: userId }, -1, id)
    ).exec();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao buscar as mensagens salvas deste usuario." });
  }
});

module.exports = router;
