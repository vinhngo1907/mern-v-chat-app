const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const messageCtrl = require('../controllers/message.controller');
const redisClient = require('../configs/redis.config');

// --- Protected Routes ---
router.get('/:id', verifyToken, messageCtrl.getMessages);
router.post('/', verifyToken, messageCtrl.createMessage);
router.delete('/:id', verifyToken, messageCtrl.deleteMessage);

// --- Mark temp deleted (public?) ---
router.post('/mark-temp-deleted', async (req, res) => {
    const { tempId } = req.body;

    if (!tempId) {
        return res.status(400).json({ msg: 'Missing tempId' });
    }

    try {
        await redisClient.set(`deleted-temp:${tempId}`, 'true', {
            EX: 60 * 5, // TTL 5 phút
        });

        res.status(200).json({ msg: 'Marked as deleted' });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;