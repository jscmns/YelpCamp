const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store the url they are requesting
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

// VALIDATE CAMPGROUND
module.exports.validateCampground = (req, res, next) => {
  // OBTAINING ERROR FROM THE BODY AND THROWING ERROR
  const { error } = campgroundSchema.validate(req.body);

  // MAP THROUGH ERROR DETAILS AND EXTRACT THE MESSAGE
  // FROM EACH ELEMENT IN ERROR ARRAY
  if (error) {
    const msg = error.details.map(elem => elem.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// VALIDATE REVIEW
module.exports.validateReview = (req, res, next) => {
  // OBTAINING ERROR FROM THE BODY AND THROWING ERROR
  const { error } = reviewSchema.validate(req.body);

  // MAP THROUGH ERROR DETAILS AND EXTRACT THE MESSAGE
  // FROM EACH ELEMENT IN ERROR ARRAY
  if (error) {
    const msg = error.details.map(elem => elem.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// CHECK AUTHOR
module.exports.isAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You don\'t have permission to do that');
    return res.redirect(`/campgrounds/${id}`)
  };
  next();
});

// CHECK REVIEW AUTHOR
module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You don\'t have permission to do that');
    return res.redirect(`/campgrounds/${id}`)
  };
  next();
});