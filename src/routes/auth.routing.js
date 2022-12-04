const express = require('express');
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register',authCtrl.register);

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', authCtrl.login);

// @route POST api/auth/activate-account
// @desc Activate account
// @access Public
router.post('/activate-account', authCtrl.activeAccount);

// @route POST api/auth/refresh-token
// @desc Refresh token
// @access Public
router.post('/refresh-token', authCtrl.refreshToken);

module.exports = router