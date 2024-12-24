const express = require("express");
const router = express.Router();
const UserModel = require("../../../models/userModel/user.model");
const MessageModel = require("../../../models/messagesModel/messages.model");
const VerifyAdmin = require("../../../middlewares/verifyAdmin/VerifyAdmin");
const Authentication = require("../../../middlewares/authentication/Authentication");
const FollowModel = require("../../../models/followModel/followModel");
const { default: mongoose } = require("mongoose");
const PipelineUser = require("../../../services/pipelines/PipelineUser");

// rota de pegar um usuario

router.get("/:id", Authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "erro ao buscar o usuario" });
  }
});

// rota para deletar um usuario

router.delete("/:id", Authentication, VerifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(id).select(
      "-password"
    );
    await MessageModel.deleteMany({ ownerId: id });
    await FollowModel.deleteMany({ followingId: id });
    await FollowModel.deleteMany({ followedId: id });
    res
      .status(200)
      .json({ msg: "usuario deletado com sucesso!", user: deletedUser });
  } catch (error) {
    res.status(500).json({ msg: "erro ao deletar usuario!" });
  }
});

// rota para seguir um user

router.patch("/follow/:id", Authentication, async (req, res) => {
  const followerId = req.params.id;
  const { id } = req.user;

  if (!followerId || followerId === id) {
    return res
      .status(422)
      .json({ msg: "não foi possivel seguir esse usuario" });
  }

  try {
    const followData = await FollowModel.create({
      followingId: id,
      followedId: followerId,
    });

    res.status(200).json({
      msg: "Usuario seguido com sucesso!",
      followData,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ouve um erro ao tentar seguir o usuario, tente novamente",
    });
  }
});

// rota para deixar de seguir um user

router.patch("/unfollow/:id", Authentication, async (req, res) => {
  const unfollowId = req.params.id;
  const { id } = req.user;

  if (!unfollowId) {
    return res.status(422).json({ msg: "id do usuario não foi informado" });
  }

  try {
    const unfollowData = await FollowModel.findOneAndDelete({
      followingId: id,
      followedId: unfollowId,
    });

    res.status(200).json({
      msg: "Usuario deixado de seguir com sucesso!",
      unfollowData,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ouve um erro ao tentar deixar de seguir o usuario, tente novamente",
    });
  }
});

// rota par pegar os usuarios que um user esta seguindo

router.get("/following/:userId", Authentication, async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await FollowModel.aggregate(
      PipelineUser(
        { followingId: new mongoose.Types.ObjectId(userId) },
        userId,
        "followedId"
      )
    ).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      msg: "Ouve um erro ao tentar buscar os usuarios que este usuario segue, tente novamente",
    });
  }
});

// rota para pegar os usuarios que estão seguindo um user

router.get("/followed/:userId", Authentication, async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await FollowModel.aggregate(
      PipelineUser(
        { followedId: new mongoose.Types.ObjectId(userId) },
        userId,
        "followingId"
      )
    ).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      msg: "Ouve um erro ao tentar buscar os usuarios que seguem este usuario, tente novamente",
    });
  }
});

module.exports = router;
