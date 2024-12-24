const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const CheckDeleteMessage = require("../../../middlewares/checkDeleteMessage/CheckDeleteMessage");
const PipelineMessageUser = require("../../../services/pipelines/PipelineMessageUser");
const { default: mongoose } = require("mongoose");
const FollowModel = require("../../../models/followModel/followModel");

const router = express.Router();

router.get("/user/:id", Authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const userAuthId = req.user.id;

    const posts = await MessageModel.aggregate(
      PipelineMessageUser(
        { ownerId: new mongoose.Types.ObjectId(id) },
        -1,
        userAuthId
      )
    ).exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "erro ao consultar seus posts!" });
  }
});

router.get("/", Authentication, async (req, res) => {
  const userAuthId = req.user.id;

  try {
    const posts = await MessageModel.aggregate(
      PipelineMessageUser({}, -1, userAuthId)
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

  try {
    const posts = await MessageModel.aggregate(
      PipelineMessageUser(
        { content: { $regex: keyWord, $options: "i" } },
        -1,
        userAuthId
      )
    ).exec();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao pesquisar por uma mensagem" });
  }
});

router.get("/following", Authentication, async (req, res) => {
  const { id } = req.user;
  const userIdAuth = new mongoose.Types.ObjectId(id);

  try {
    const pipeline = [
      {
        $match: { followingId: userIdAuth },
      },

      {
        $lookup: {
          from: "users",
          localField: `followedId`,
          foreignField: "_id",
          as: "owner",
        },
      },

      {
        $unwind: "$owner",
      },

      {
        $lookup: {
          from: "messages",
          localField: `owner._id`,
          foreignField: "ownerId",
          as: "message",
        },
      },

      {
        $unwind: "$message",
      },

      {
        $sort: { "message.createdAt": -1 },
      },

      {
        $addFields: {
          isLiked: { $in: [userIdAuth, "$message.likes"] },

          isSaved: { $in: [userIdAuth, "$message.saves"] },

          likesCount: { $size: "$message.likes" },

          savesCount: { $size: "$message.saves" },
        },
      },

      {
        $project: {
          _id: 0,
          followingId: 1,
          "message._id": 1,
          "message.name": 1,
          "message.content": 1,
          "message.createdAt": 1,
          isLiked: 1,
          isSaved: 1,
          likesCount: 1,
          savesCount: 1,
          "owner._id": 1,
          "owner.name": 1,
          "owner.role": 1,
          "owner.profileImg": 1,
        },
      },
    ];

    const result = await FollowModel.aggregate(pipeline).exec();
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
