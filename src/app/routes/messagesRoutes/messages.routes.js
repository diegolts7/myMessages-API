const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const CheckDeleteMessage = require("../../../middlewares/checkDeleteMessage/CheckDeleteMessage");

const router = express.Router();

router.get("/:id", Authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const posts = await MessageModel.find({ ownerId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "erro ao consultar seus posts!" });
  }
});

router.get("/all", Authentication, async (req, res) => {
  try {
    const posts = await MessageModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "erro ao consultar todos os posts!" });
  }
});

router.get("/:title", Authentication, async (req, res) => {
  try {
    const title = req.params.title;
    const messagesByTitle = await MessageModel.find({
      content: { $regex: title, $options: "i" },
    });
    res.status(200).json(messagesByTitle);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "erro na requisição de posts por titulo de mensagem!" });
  }
});

router.post("/", Authentication, async (req, res) => {
  try {
    const { content } = req.body;
    const { id, name } = req.user;

    if (!content || content === "") {
      return res
        .status(422)
        .json({ msg: "o conteudo da mensagem é obrigatório!" });
    }

    const createdPost = await MessageModel.create({
      ownerId: id,
      ownerName: name,
      content,
    });

    res
      .status(200)
      .json({ msg: "mensagem criado com sucesso!", post: createdPost });
  } catch (error) {
    res.status(500).json({ msg: "erro ao criar mensagem!" });
  }
});

router.delete("/:id", Authentication, CheckDeleteMessage, async (req, res) => {
  try {
    messageId = req.params.id;
    const deletedMessage = await MessageModel.findByIdAndDelete(messageId);
    res
      .status(200)
      .json({ msg: "mensagem deletada com sucesso!", post: deletedMessage });
  } catch (error) {
    res.status(500).json({ msg: "erro ao deletar mensagem!" });
  }
});

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

module.exports = router;
