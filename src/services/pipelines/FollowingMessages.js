const { default: mongoose } = require("mongoose");

const FollowingMessages = (id, page, limit) => {
  const userIdAuth = new mongoose.Types.ObjectId(id);
  const skip = (page - 1) * limit;

  return [
    {
      $match: { followingId: userIdAuth },
    },

    { $skip: skip },
    { $limit: limit },

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
        _id: "$message._id",
        content: "$message.content",
        createdAt: "$message.createdAt",
        isLiked: 1,
        isSaved: 1,
        likesCount: 1,
        savesCount: 1,
        "owner._id": 1,
        "owner.name": 1,
        "owner.handle": 1,
        "owner.role": 1,
        "owner.profileImg": 1,
      },
    },
  ];
};

module.exports = FollowingMessages;
