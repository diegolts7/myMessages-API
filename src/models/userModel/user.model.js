const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  profileImg: {
    nameImg: {
      type: String,

      default: "",
    },
    srcImg: {
      type: String,
      default: "",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
