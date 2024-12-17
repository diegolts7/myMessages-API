const mongoose = require("mongoose");

const likeMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeMessageSchema.index({ messageId: 1, userId: 1 }, { unique: true });

const LikeMessageModel = mongoose.model("LikeMessage", likeMessageSchema);

module.exports = LikeMessageModel;
