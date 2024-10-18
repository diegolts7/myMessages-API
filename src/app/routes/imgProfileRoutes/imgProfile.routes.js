const express = require("express");
const route = express.Router();
const fs = require("fs");
const Authentication = require("../../../middlewares/authentication/Authentication");
const UserModel = require("../../../models/userModel/user.model");
const deleteFromS3 = require("../../../services/deleteImgProfile/deleteImgProfile");
const uploadToS3 = require("../../../services/uploadImgProfile/uploadImgProfile");
const upload = require("../../../config/multer/multer");

route.post(
  "/imgProfile",
  Authentication,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ msg: "Nenhum arquivo encontrado!" });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const { id } = req.user;

    try {
      const data = await uploadToS3(filePath, fileName);

      const urlImage = data.Location;
      const userProfileModified = await UserModel.findByIdAndUpdate(
        id,
        { profileImg: { nameImg: fileName, srcImg: urlImage } },
        { new: true }
      ).select("-password");

      fs.unlinkSync(filePath);

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
  const { id } = req.user;

  try {
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
