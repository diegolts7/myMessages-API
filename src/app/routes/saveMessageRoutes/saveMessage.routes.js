const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const { default: mongoose } = require("mongoose");
const PipelineMessageUser = require("../../../services/pipelines/PipelineMessageUser");

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

  try {
    const pipeline = [
      // Filtrar pela mensagem desejada (opcional, se você quiser focar em uma mensagem específica)
      {
        $match: { _id: new mongoose.Types.ObjectId(messageId) }, // Substitua messageId pelo ID da mensagem
      },

      // Desestruturar os IDs no campo likes
      {
        $unwind: "$saves",
      },

      // Fazer o lookup para obter os dados dos usuários a partir dos IDs em likes
      {
        $lookup: {
          from: "users", // Nome da coleção de usuários
          localField: "saves", // Campo em messages que contém os IDs de usuários
          foreignField: "_id", // Campo _id na coleção de usuários
          as: "user", // Nome do campo onde os dados do usuário serão inseridos
        },
      },

      // Desestruturar o array "user" (cada like corresponde a um único usuário)
      {
        $unwind: "$user",
      },

      // Projetar apenas os campos necessários
      {
        $project: {
          _id: 0, // Exclui o ID da mensagem
          "user._id": 1, // ID do usuário
          "user.name": 1, // Nome do usuário
          "user.profileImg": 1,
          "user.role": 1, // Imagem de perfil do usuário
        },
      },
    ];

    const result = await MessageModel.aggregate(pipeline).exec();
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
