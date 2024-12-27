const { default: mongoose } = require("mongoose");

const UsersByName = (userName, page, limit, userId) => {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  const skip = (page - 1) * limit;
  return [
    {
      $match: { handle: { $regex: userName, $options: "i" } },
    },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },

          {
            $lookup: {
              from: "follows",
              let: { followedId: "$_id" },
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
              _id: 1,
              name: 1,
              handle: 1,
              description: 1,
              profileImg: 1,
              role: 1,
              isFollowing: 1,
            },
          },
        ],
        totalCount: [
          { $count: "size" }, // Conta o número total de documentos correspondentes
        ],
      },
    },
    {
      $project: {
        data: 1,
        size: { $arrayElemAt: ["$totalCount.size", 0] }, // Extrai o valor do totalCount
      },
    },
  ];
};

module.exports = UsersByName;
