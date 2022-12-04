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

module.exports = router