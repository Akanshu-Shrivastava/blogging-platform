const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blogging_platform',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const parser = multer({ storage });

module.exports = parser;
