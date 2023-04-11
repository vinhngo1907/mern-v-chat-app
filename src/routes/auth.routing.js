const express = require('express');
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
*/
router.post('/register', authCtrl.register);

/** 
 * @route POST api/auth/login
 * @desc Login user
 * @access Public
*/
router.post('/login', authCtrl.login);

/**
 * @route POST api/auth/activate-account
 * @desc Activate account
 * @access Public
*/
router.post('/activate-account', authCtrl.activeAccount);

/**  
 * @route POST api/auth/refresh-token
 * @desc Refresh token
 * @access Public
*/
router.post('/refresh-token', authCtrl.refreshToken);

/**  
 * @route POST api/auth/logout
 * @desc Logout
 * @access Public
*/
router.post('/logout', authCtrl.logout);

/**  
 * @route POST api/auth/forgot-password
 * @desc Logout
 * @access Public
*/

router.post('/forgot-password', authCtrl.forgotPassword);

/**  
 * @route POST api/auth/google-login
 * @desc Google login
 * @access Public
*/
router.post('/google-login', authCtrl.googleLogin);

/**  
 * @route POST api/auth/facebook-login
 * @desc Google login
 * @access Public
*/
router.post('/facebook-login', authCtrl.facebookLogin);

module.exports = router;