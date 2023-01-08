const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const verifyToken = require('../middleware/auth.middleware');

/**
 * @route GET api/user
 * @desc Check if user is logged in
 * @access Private
 */
router.get('/', verifyToken, userCtrl.getMe);
/**
 * @route GET api/user/:id
 * @desc Get user by id
 * @access Private
 */
router.get('/search', verifyToken, userCtrl.search);

/**
 * @route GET api/user/:id
 * @desc Get user by id
 * @access Private
 */
router.get('/:id', verifyToken, userCtrl.getUser);

/**
 * @route PATCH api/user
 * @desc Check if user is logged in
 * @access Private
 */
router.patch('/', verifyToken, userCtrl.update);

/**
 * @route PATCH api/user/change-password
 * @desc Allow user update new password if user is logged in
 * @access Private
 */
router.patch('/change-password', verifyToken, userCtrl.changePassword);

/**
 * @route PUT api/user/reset-password
 * @desc Reset new password
 * @access Private
 */
router.put('/reset-password', verifyToken, userCtrl.resetPassword);

module.exports = router;