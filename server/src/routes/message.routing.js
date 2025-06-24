const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const messageCtrl = require('../controllers/message.controller');
const redisClient = require('../configs/redis.config');

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

router.post("/mark-temp-deleted", async (req, res) => {
    const { tempId } = req.body;
    if (!tempId) return res.status(400).json({ msg: 'Missing tempId' });

    await redisClient.set(`deleted-temp:${tempId}`, 'true', {
        EX: 60 * 5 // giữ trong Redis 5 phút
    });

    res.status(200).json({ msg: 'Marked as deleted' });
});

module.exports = router