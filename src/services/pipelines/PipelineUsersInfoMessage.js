const { default: mongoose } = require("mongoose");

const PipelineUsersInfoMessage = (messageId, localfield) => {
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
      $project: {
        _id: 0,
        "user._id": 1,
        "user.name": 1,
        "user.handle": 1,
        "user.description": 1,
        "user.profileImg": 1,
        "user.role": 1,
      },
    },
  ];
};

module.exports = PipelineUsersInfoMessage;
