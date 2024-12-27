const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const CheckDeleteMessage = require("../../../middlewares/checkDeleteMessage/CheckDeleteMessage");
const PipelineMessageUser = require("../../../services/pipelines/PipelineMessageUser");
const { default: mongoose } = require("mongoose");
const FollowModel = require("../../../models/followModel/followModel");
const { usersMessagesSchema } = require("../../../validators/queryValidator");
const FollowingMessages = require("../../../services/pipelines/FollowingMessages");

const router = express.Router();

router.get("/user/:id", Authentication, async (req, res) => {
  const { page, limit } = usersMessagesSchema.parse(req.query);

  try {
    const id = req.params.id;
    const userAuthId = req.user.id;

    const posts = await MessageModel.aggregate(
      PipelineMessageUser(
        { ownerId: new mongoose.Types.ObjectId(id) },
        -1,
        userAuthId,
        page,
        limit
      )
    ).exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "erro ao consultar seus posts!" });
  }
});

router.get("/", Authentication, async (req, res) => {
  const userAuthId = req.user.id;

  const { page, limit } = usersMessagesSchema.parse(req.query);

  try {
    const posts = await MessageModel.aggregate(
      PipelineMessageUser({}, -1, userAuthId, page, limit)
    ).exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      msg: "erro ao consultar todos os posts!",
    });
  }
});

router.get("/search/:keyWord", Authentication, async (req, res) => {
  const userAuthId = req.user.id;
  const keyWord = req.params.keyWord;

  const { page, limit } = usersMessagesSchema.parse(req.query);

  try {
    const posts = await MessageModel.aggregate(
      PipelineMessageUser(
        { content: { $regex: keyWord, $options: "i" } },
        -1,
        userAuthId,
        page,
        limit
      )
    ).exec();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao pesquisar por uma mensagem" });
  }
});

router.get("/following", Authentication, async (req, res) => {
  const { id } = req.user;

  const { page, limit } = usersMessagesSchema.parse(req.query);

  try {
    const result = await FollowModel.aggregate(
      FollowingMessages(id, page, limit)
    ).exec();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "erro na requisição de posts por titulo de mensagem!" });
  }
});

router.post("/", Authentication, async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.user;

    if (!content || content === "") {
      return res
        .status(422)
        .json({ msg: "o conteudo da mensagem é obrigatório!" });
    }

    const createdPost = await MessageModel.create({
      ownerId: id,
      content,
    });

    res
      .status(200)
      .json({ msg: "mensagem criado com sucesso!", message: createdPost });
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
      .json({ msg: "mensagem deletada com sucesso!", message: deletedMessage });
  } catch (error) {
    res.status(500).json({ msg: "erro ao deletar mensagem!" });
  }
});

module.exports = router;
