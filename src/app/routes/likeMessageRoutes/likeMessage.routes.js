const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const { default: mongoose } = require("mongoose");
const PipelineMessageUser = require("../../../services/pipelines/PipelineMessageUser");
const PipelineUsersInfoMessage = require("../../../services/pipelines/PipelineUsersInfoMessage");

const router = express.Router();

router.patch("/like/:id", Authentication, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { id } = req.user;
    const modifiedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { $addToSet: { likes: id } },
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "mensagem curtida com sucesso", message: modifiedMessage });
  } catch (error) {
    res.status(500).json({ msg: "erro ao curtir a mensagem" });
  }
});

router.patch("/deslike/:id", Authentication, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { id } = req.user;
    const modifiedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { $pull: { likes: id } },
      { new: true }
    );
    res.status(200).json({
      msg: "mensagem descurtida com sucesso",
      message: modifiedMessage,
    });
  } catch (error) {
    res.status(500).json({ msg: "erro ao descurtir a mensagem" });
  }
});

router.get("/users/:messageId", Authentication, async (req, res) => {
  const messageId = req.params.messageId;
  const idUserAuth = req.user.id;

  try {
    const result = await MessageModel.aggregate(
      PipelineUsersInfoMessage(messageId, "likes", idUserAuth)
    ).exec();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao buscar os usuarios que curtiram a mensagem." });
  }
});

router.get("/:userId", Authentication, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const id = req.user.id;

  try {
    const result = await MessageModel.aggregate(
      PipelineMessageUser({ likes: userId }, -1, id)
    ).exec();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao buscar as mensagens curtidas deste usuario." });
  }
});

module.exports = router;
