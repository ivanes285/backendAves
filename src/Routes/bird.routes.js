const router = require('express').Router()
const {getBirds, createBird,updateBird,deleteBird} = require('../Controllers/birdController')
const cloudinary = require("cloudinary");
const multer = require("multer");
const path= require("path");

//Configuracion Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

//   Configuracion Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/images");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().getTime() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });



router.route('/birds').get(getBirds).post([upload.array("file"),createBird])


router.route('/birds/:id').delete(deleteBird).put([upload.array("file"),updateBird])

module.exports = router