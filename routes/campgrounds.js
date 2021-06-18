const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campCtrls = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// RENDER CREATE PAGE
router.get('/create', isLoggedIn, campCtrls.renderCreate);

router.route('/')
  // RENDER INDEX OF CAMPGROUNDS
  .get(catchAsync(campCtrls.index))
  // CREATE A CAMPGROUND
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campCtrls.create));

// RENDER EDIT PAGE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campCtrls.renderEdit));

router.route('/:id')
  // RENDER SHOW PAGE
  .get(catchAsync(campCtrls.renderShow))
  // EDIT CAMPGROUND
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campCtrls.edit))
  // DELETE CAMPGROUND
  .delete(isLoggedIn, isAuthor, catchAsync(campCtrls.delete));

module.exports = router;