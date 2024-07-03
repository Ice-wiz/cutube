const dotenv = require('dotenv');

dotenv.config()

const AWS = require('aws-sdk');

console.log(process.env.AWS_REGION,"region is this")

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

module.exports = { s3, bucketName };
