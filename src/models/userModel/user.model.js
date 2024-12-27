const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
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
    description: {
      type: String,
      default: "",
      maxlength: 150,
    },
    dateBirth: {
      type: Date,
      required: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 20,
      match: /^[a-zA-Z0-9_.]+$/,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
