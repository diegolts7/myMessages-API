const { default: mongoose } = require("mongoose");

const PipelineMessageUser = (filtro, sort, userId, page, limit) => {
  const id = new mongoose.Types.ObjectId(userId);
  const skip = (page - 1) * limit;

  return [
    {
      $match: filtro, // Substitua messageId pelo ID da mensagem
    },

    {
      $sort: { createdAt: sort },
    },

    { $skip: skip },
    { $limit: limit },

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
        isLiked: { $in: [id, "$likes"] },

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
          handle: 1,
          name: 1, // Nome do usuário
          profileImg: 1, // Imagem de perfil do usuário
          role: 1, // Papel do usuário
        },
        // Conteúdo da mensagem
        createdAt: 1,
      },
    },
  ];
};

module.exports = PipelineMessageUser;
