const { default: mongoose } = require("mongoose");

const PipelineUser = (filtro, idUser, localfield) => {
  const userIdObjectId = new mongoose.Types.ObjectId(idUser);
  return [
    {
      $match: filtro,
    },

    {
      $sort: { createdAt: -1 },
    },

    {
      $lookup: {
        from: "users",
        localField: localfield,
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $project: {
        _id: 0,
        followingId: 1,
        followedId: 1,
        "user.name": 1,
        "user.handle": 1,
        "user.description": 1,
        "user.profileImg": 1,
        "user.role": 1,
      },
    },
  ];
};

module.exports = PipelineUser;
