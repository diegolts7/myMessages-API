const express = require("express");
const route = express.Router();
const UserModel = require("../../../models/userModel/user.model");
const MessageModel = require("../../../models/messagesModel/messages.model");
const VerifyAdmin = require("../../../middlewares/verifyAdmin/VerifyAdmin");
const Authentication = require("../../../middlewares/authentication/Authentication");

// rota de pegar um usuario

route.get("/users/:id", Authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "erro ao buscar o usuario" });
  }
});

// rota para deletar um usuario

route.delete("/users/:id", Authentication, VerifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(id).select(
      "-password"
    );
    await MessageModel.deleteMany({ ownerId: id });
    res
      .status(200)
      .json({ msg: "usuario deletado com sucesso!", user: deletedUser });
  } catch (error) {
    res.status(500).json({ msg: "erro ao deletar usuario!" });
  }
});

module.exports = route;
