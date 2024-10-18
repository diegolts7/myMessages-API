const s3Client = require("../../config/aws/aws-s3");
const fs = require("fs");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const deleteFromS3 = async (fileName) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(deleteParams));
    return data;
  } catch (error) {
    console.error("Erro ao deletar o arquivo:", err);
    throw err;
  }
};

module.exports = deleteFromS3;
