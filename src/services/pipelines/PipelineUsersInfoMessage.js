const { default: mongoose } = require("mongoose");

const PipelineUsersInfoMessage = (messageId, localfield, idUserAuth) => {
  const userIdObjectId = new mongoose.Types.ObjectId(idUserAuth);
  return [
    {
      $match: { _id: new mongoose.Types.ObjectId(messageId) },
    },

    {
      $unwind: "$" + localfield,
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
        _id: "user._id",
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

module.exports = PipelineUsersInfoMessage;
