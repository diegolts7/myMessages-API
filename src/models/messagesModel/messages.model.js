const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ownerName: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;
