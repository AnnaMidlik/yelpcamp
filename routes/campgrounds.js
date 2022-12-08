const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campground = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
  .get(catchAsync(campground.index))
  .post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campground.createCamp));
router.get('/new', isLoggedIn, campground.newCampForm);

router.route('/:id')
  .get(catchAsync(campground.showCamp))
  .put(isLoggedIn, isAuthor, upload.array('campground[image]'), validateCampground, catchAsync(campground.updateCamp))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editForm))

module.exports = router;