const express = require("express");
const Authentication = require("../../../middlewares/authentication/Authentication");
const MessageModel = require("../../../models/messagesModel/messages.model");
const { default: mongoose } = require("mongoose");

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

  try {
    const pipeline = [
      // Filtrar pela mensagem desejada (opcional, se você quiser focar em uma mensagem específica)
      {
        $match: { _id: new mongoose.Types.ObjectId(messageId) }, // Substitua messageId pelo ID da mensagem
      },

      // Desestruturar os IDs no campo likes
      {
        $unwind: "$likes",
      },

      // Fazer o lookup para obter os dados dos usuários a partir dos IDs em likes
      {
        $lookup: {
          from: "users", // Nome da coleção de usuários
          localField: "likes", // Campo em messages que contém os IDs de usuários
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
      .json({ msg: "Erro ao buscar os usuarios que curtiram a mensagem." });
  }
});

router.get("/:userId", Authentication, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const id = new mongoose.Types.ObjectId(req.user.id);

  try {
    const pipeline = [
      {
        $match: { likes: userId }, // Substitua messageId pelo ID da mensagem
      },

      {
        $lookup: {
          from: "users", // Nome da coleção de usuários
          localField: `ownerId`, // Campo em messages que contém os IDs de usuários
          foreignField: "_id", // Campo _id na coleção de usuários
          as: "owner", // Nome do campo onde os dados do usuário serão inseridos
        },
      },

      {
        $unwind: "$owner",
      },

      {
        $addFields: {
          // Verifica se o ID do usuário está presente no array de likes
          isLiked: true,

          // Verifica se o ID do usuário está presente no array de saves
          isSaved: { $in: [id, "$saves"] },

          // Conta o número de likes
          likesCount: { $size: "$likes" },

          // Conta o número de saves
          savesCount: { $size: "$saves" },
        },
      },

      {
        $project: {
          _id: 1,
          content: 1,
          isLiked: 1,
          isSaved: 1,
          likesCount: 1,
          savesCount: 1,
          owner: {
            _id: 1, // ID do usuário que curtiu
            name: 1, // Nome do usuário
            profileImg: 1, // Imagem de perfil do usuário
            role: 1, // Papel do usuário
          },
          // Conteúdo da mensagem
          createdAt: 1,
        },
      },
    ];

    const result = await MessageModel.aggregate(pipeline).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar as mensagens deste usuario." });
  }
});

module.exports = router;
