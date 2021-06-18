const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const reviewCtrls = require('../controllers/reviews');

// POST REVIEW ROUTE
router.post('/', validateReview, isLoggedIn, catchAsync(reviewCtrls.post));

// DESTROY REVIEW ROUTE
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewCtrls.delete));

module.exports = router;
