const mongoose = require("mongoose");

const saveMessageSchema = new mongoose.Schema(
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

saveMessageSchema.index({ messageId: 1, userId: 1 }, { unique: true });

const SaveMessageModel = mongoose.model("SaveMessage", saveMessageSchema);

module.exports = SaveMessageModel;
