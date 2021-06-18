const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const userCtrls = require('../controllers/users');

router.route('/register')
  // RENDER REGISTER PAGE
  .get(userCtrls.renderReg)
  // REGISTER
  .post(catchAsync(userCtrls.register));

router.route('/login')
  // RENDER LOGIN PAGE
  .get(userCtrls.renderLogin)
  // LOGIN
  .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(userCtrls.login));

// LOGOUT
router.get('/logout', userCtrls.logout)

module.exports = router;