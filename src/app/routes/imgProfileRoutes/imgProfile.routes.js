const express = require("express");
const route = express.Router();
const Authentication = require("../../../middlewares/authentication/Authentication");
const UserModel = require("../../../models/userModel/user.model");
const deleteFromS3 = require("../../../services/deleteImgProfile/deleteImgProfile");
const upload = require("../../../config/multer/multer");

route.post(
  "/imgProfile",
  Authentication,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "Nenhum arquivo encontrado!" });
      }

      const { location, key } = req.file;
      const { id } = req.user;

      const userProfileModified = await UserModel.findByIdAndUpdate(
        id,
        { profileImg: { nameImg: key, srcImg: location } },
        { new: true }
      ).select("-password");

      res.status(200).json({
        msg: "Imagem de perfil atualizada com sucesso!",
        user: userProfileModified,
      });
    } catch (error) {
      res.status(500).json({ msg: "Erro ao fazer upload!" });
    }
  }
);

route.delete("/imgProfile", Authentication, async (req, res) => {
  try {
    const { id } = req.user;

    const user = await UserModel.findById(id);

    if (!user || !user.profileImg.nameImg || !user.profileImg.srcImg) {
      return res.status(400).json({ msg: "imagem de perfil inexistente!" });
    }

    const nomeImg = user.profileImg.nameImg;

    await deleteFromS3(nomeImg);

    const userModified = await UserModel.findByIdAndUpdate(
      id,
      {
        profileImg: { nameImg: "", srcImg: "" },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      msg: "foto de perfil removida com sucesso!",
      user: userModified,
    });
  } catch (error) {
    res.status(500).json({ msg: "erro ao deletar a imagem de perfil." });
  }
});

module.exports = route;
