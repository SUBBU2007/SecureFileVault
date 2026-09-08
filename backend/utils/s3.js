const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function uploadToS3(buffer, key) {
  await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key, Body: buffer }));
}

async function getFromS3(key) {
  const response = await s3.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key }));
  const chunks = [];
  for await (const chunk of response.Body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = { uploadToS3, getFromS3 };