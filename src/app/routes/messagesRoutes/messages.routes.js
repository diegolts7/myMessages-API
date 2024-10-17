const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const CheckDeleteMessage = require("../../../middlewares/checkDeleteMessage/CheckDeleteMessage");

const route = express.Router();

route.get("/:id", Authentication, async (req, res) => {
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

route.get("/all", Authentication, async (req, res) => {
  try {
    const posts = await MessageModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "erro ao consultar todos os posts!" });
  }
});

route.get("/:title", Authentication, async (req, res) => {
  try {
    const title = req.params.title;
    const messagesByTitle = await MessageModel.find({
      title: { $regex: title, $options: "i" },
    });
    res.status(200).json(messagesByTitle);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "erro na requisição de posts por titulo de mensagem!" });
  }
});

route.post("/", Authentication, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id, name } = req.user;

    if (!title || title === "") {
      return res.status(422).json({ msg: "o titulo do post é obrigatório!" });
    }
    if (!content || content === "") {
      return res.status(422).json({ msg: "o conteudo do post é obrigatório!" });
    }

    const createdPost = await MessageModel.create({
      ownerId: id,
      ownerName: name,
      title,
      content,
    });

    res
      .status(200)
      .json({ msg: "post criado com sucesso!", post: createdPost });
  } catch (error) {
    res.status(500).json({ msg: "erro ao criar mensagem!" });
  }
});

route.delete("/:id", Authentication, CheckDeleteMessage, async (req, res) => {
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

module.exports = route;
