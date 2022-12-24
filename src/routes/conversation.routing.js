const router = require("express").Router();
const verifyToken = require("../middleware/auth.middleware");
const conversationCtrl = require("../controllers/conversation.controller");

/**
 *  @route GET api/posts
 * @desc Get conversations of user
 * @access Private
*/
router.get('/', verifyToken, conversationCtrl.getConversation)

/**
 * @route GET api/posts
 * @desc Get posts
 * @access Private
*/ router.delete('/:id', verifyToken, conversationCtrl.deleteConversation);

module.exports = router;