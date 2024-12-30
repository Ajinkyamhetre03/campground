const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('DATABASE_URL', process.env.DATABASE_URL)
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
//   secure: true,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    // folder:'yelpcamp',
    // allowedFormats:['jpeg','jpg', 'png'],
    params: {
      folder: 'yelpcamp',
      allowedFormats: ['jpeg','jpg', 'png'], // supports promises as well
      //public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports={storage, cloudinary}