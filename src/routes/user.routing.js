const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const verifyToken = require('../middleware/auth.middleware');

/**
 * @route GET api/user
 * @desc Check if user is logged in
 * @access Public
 */
router.get('/', verifyToken, userCtrl.getMe);
/**
 * @route GET api/user/:id
 * @desc Get user by id
 * @access Public
 */
router.get('/search', verifyToken, userCtrl.search);

/**
 * @route PATCH api/user
 * @desc Check if user is logged in
 * @access Public
 */
router.patch('/', verifyToken, userCtrl.update);

/**
 * @route PATCH api/user
 * @desc Allow user update new password if user is logged in
 * @access Public
 */
router.patch('/', verifyToken, userCtrl.changePassword);

/**
 * @route GET api/user/:id
 * @desc Get user by id
 * @access Public
 */
router.get('/:id', verifyToken, userCtrl.getUser);

module.exports = router;