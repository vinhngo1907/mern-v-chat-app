const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const messageCtrl = require('../controllers/message.controller');

/**
 * @route GET api/message
 * @desc Get messages
 * @access Private
 */
router.get('/:id', verifyToken, messageCtrl.getMessages);

/**
 * @route POST api/message
 * @desc Create message
 * @access Private
 */

router.post("/", verifyToken, messageCtrl.createMessage);


/**
 * @route DELETE api/message
 * @desc Dlete messages
 * @access Private
 */
router.delete('/:id', verifyToken, messageCtrl.deleteMessage);

module.exports = router