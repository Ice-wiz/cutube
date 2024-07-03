const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnailUrl:{
    type : String,
    required:true
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
