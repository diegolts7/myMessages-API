const express = require("express");
const router = express.Router();
const UserModel = require("../../../models/userModel/user.model");
const MessageModel = require("../../../models/messagesModel/messages.model");
const VerifyAdmin = require("../../../middlewares/verifyAdmin/VerifyAdmin");
const Authentication = require("../../../middlewares/authentication/Authentication");

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
    res
      .status(200)
      .json({ msg: "usuario deletado com sucesso!", user: deletedUser });
  } catch (error) {
    res.status(500).json({ msg: "erro ao deletar usuario!" });
  }
});

router.patch("/follow/:id", Authentication, async (req, res) => {
  const followerId = req.params.id;
  const { id } = req.user;

  if (!followerId) {
    return res.status(422).json({ msg: "id do usuario não foi informado" });
  }

  try {
    await UserModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { following: followerId },
      },
      { new: true }
    );

    const userFollowedModified = await UserModel.findByIdAndUpdate(
      followerId,
      {
        $addToSet: { followers: id },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      msg: "Usuario seguido com sucesso!",
      followed: userFollowedModified,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ouve um erro ao tentar seguir o usuario, tente novamente",
    });
  }
});

router.patch("/unfollow/:id", Authentication, async (req, res) => {
  const unfollowId = req.params.id;
  const { id } = req.user;

  if (!unfollowId) {
    return res.status(422).json({ msg: "id do usuario não foi informado" });
  }

  try {
    await UserModel.findByIdAndUpdate(
      id,
      {
        $pull: { following: unfollowId },
      },
      { new: true }
    ).select("-password");

    const userUnfollowModified = await UserModel.findByIdAndUpdate(
      unfollowId,
      {
        $pull: { followers: id },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      msg: "Usuario deixado de seguir com sucesso!",
      unfollow: userUnfollowModified,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ouve um erro ao tentar deixar de seguir o usuario, tente novamente",
    });
  }
});

module.exports = router;
