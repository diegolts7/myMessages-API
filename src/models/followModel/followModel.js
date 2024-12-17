const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

followSchema.index({ followingId: 1, followedId: 1 }, { unique: true });

const FollowModel = mongoose.model("Follow", followSchema);

module.exports = FollowModel;
