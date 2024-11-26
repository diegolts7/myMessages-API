const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const s3Client = require("../aws/aws-s3");

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

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    acl: "public-read",
    key: (req, file, cb) => {
      const fileName = `${Date.now().toString()}${path.extname(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
