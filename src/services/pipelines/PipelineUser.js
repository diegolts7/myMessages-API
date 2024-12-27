const { default: mongoose } = require("mongoose");

const PipelineUser = (filtro, idUserAuth, localfield) => {
  const userIdObjectId = new mongoose.Types.ObjectId(idUserAuth);
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
      $lookup: {
        from: "follows",
        let: { followedId: "$user._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followedId", "$$followedId"] },
                  { $eq: ["$followingId", userIdObjectId] },
                ],
              },
            },
          },
        ],
        as: "following",
      },
    },
    {
      $addFields: {
        isFollowing: { $gt: [{ $size: "$following" }, 0] }, // Verifica se há algum documento em "following"
      },
    },

    {
      $project: {
        _id: 0,
        followingId: 1,
        followedId: 1,
        name: "$user.name",
        handle: "$user.handle",
        description: "$user.description",
        profileImg: "$user.profileImg",
        role: "$user.role",
        isFollowing: 1,
      },
    },
  ];
};

module.exports = PipelineUser;
