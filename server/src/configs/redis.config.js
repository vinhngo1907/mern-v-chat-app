const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('connect', () => {
    console.log('🟢 Redis connected successfully');
});

redisClient.on('error', (err) => {
    console.error('🔴 Redis connection error:', err);
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('🔴 Redis connect() failed:', err);
    }
})();

module.exports = redisClient;