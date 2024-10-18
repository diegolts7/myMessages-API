const s3Client = require("../../config/aws/aws-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");

const uploadToS3 = async (filePath, fileName) => {
  const fileContent = fs.createReadStream(filePath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  const upload = new Upload({
    client: s3Client,
    params,
  });

  try {
    const data = await upload.done();
    return data;
  } catch (err) {
    console.error("Erro durante o upload:", err);
    throw err;
  }
};

module.exports = uploadToS3;
