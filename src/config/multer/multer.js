const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../temp"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  if (
    fileTypes.test(path.extname(file.originalname).toLowerCase()) &&
    fileTypes.test(file.mimetype)
  ) {
    return cb(null, true);
  }
  cb(new Error("Esse tipo de arquivo não é permitido!"));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
