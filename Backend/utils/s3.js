const { s3, bucketName } = require('../config/aws');

const uploadFile = (file, folder) => {
    const timestamp = Date.now();
    const params = {
      Bucket: bucketName,
      Key: `${folder}/${file.originalname}-${timestamp}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    return s3.upload(params).promise()
      .then(data => {
        console.log('Upload Success', data);
        return data;
      })
      .catch(err => {
        console.error('Upload Error', err);
        throw err;
      });
  };
  

const uploadProfilePicture = (file) => uploadFile(file, 'profile-pictures');
const uploadVideo = (file) => uploadFile(file, 'uploaded-videos');
const uploadThumbnail = (file) => uploadFile(file, 'video-thumbnails');

module.exports = { uploadProfilePicture, uploadVideo, uploadThumbnail };
