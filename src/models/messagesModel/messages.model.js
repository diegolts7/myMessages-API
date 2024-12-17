const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;
