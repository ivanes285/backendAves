const router = require('express').Router()
const {getPlaces,createPlace,updatePlace,deletePlace} = require('../Controllers/placeController')
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



router.route('/places').get(getPlaces).post([upload.array("file"),createPlace])


router.route('/places/:id').delete(deletePlace).put([upload.array("file"),updatePlace])

module.exports = router