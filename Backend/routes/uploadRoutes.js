const express = require('express');
const multer = require('multer');
const { uploadProfilePicture, uploadVideo, uploadThumbnail } = require('../utils/s3');
const User = require('../models/User');
const Video = require('../models/Video');
const { protect } = require('../utils/authMiddleware');

const router = express.Router();

// Custom file filter to restrict file types
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  };
};

// Middleware to handle profile picture uploads with size limit of 1MB and specific file types
const uploadProfilePic = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 1MB
  fileFilter: fileFilter(['image/png', 'image/jpg', 'image/jpeg']),
});

// Middleware to handle video and thumbnail uploads with specific file types and size limits
const uploadFiles = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: fileFilter(['video/mp4', 'image/png', 'image/jpg', 'image/jpeg']),
});

router.post('/profile-picture', protect, uploadProfilePic.single('file'), async (req, res, next) => {
  try {
    const result = await uploadProfilePicture(req.file);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = result.Location;
    await user.save();

    res.status(200).json({ message: 'Profile picture updated successfully', profilePictureUrl: result.Location , success:true});
  } catch (error) {
    next(error);
  }
});

router.post('/video', protect, uploadFiles.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    if (!videoFile || !thumbnailFile) {
      throw new Error('Both video and thumbnail files are required.');
    }

    const videoUploadResult = await uploadVideo(videoFile);
    const thumbnailUploadResult = await uploadThumbnail(thumbnailFile);

    const newVideo = new Video({
      videoUrl: videoUploadResult.Location,
      title,
      description,
      thumbnailUrl: thumbnailUploadResult.Location,
    });

    await newVideo.save();

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new Error('User not found.');
    }

    user.videos.push(newVideo._id);
    await user.save();

    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo , success:true });
  } catch (error) {
    next(error);
  }
});

// Error-handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size should be less than or equal to the limit.' });
    }
  } else if (err.message === 'Invalid file type') {
    return res.status(400).json({ error: 'Invalid file type. Only allowed types are specified.' });
  }
  res.status(500).json({ error: err.message });
});

module.exports = router;
