const express = require('express');
const router = express.Router();
const notifyCtrl = require("../controllers/notify.controller");
const verifyToken = require("../middleware/auth.middleware");

/**
 * @route GET api/notification
 * @desc Create notification
 * @access Public
*/
router.get('/', verifyToken, notifyCtrl.getAllNotifies);

/**
 * @route POST api/notification
 * @desc Create notification
 * @access Public
*/
router.post('/', verifyToken, notifyCtrl.createNotify);

/**
 * @route DELETE api/notification
 * @desc Remove a notification
 * @access Public
*/
router.delete('/:id', verifyToken, notifyCtrl.removeNotify);

/**
 * @route DELETE api/notification
 * @desc Delete all notifies of user
 * @access Public
*/
router.delete('/', verifyToken, notifyCtrl.deleteAllNotifies);

/**
 * @route PATCH api/notification
 * @desc Readed notification
 * @access Public
*/
router.patch('/:id', verifyToken, notifyCtrl.isReadNotify);

module.exports = router;