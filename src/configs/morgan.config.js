const rfs = require("rotating-file-stream");
const path = require("path");
const morgan = require("morgan");

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.resolve(__dirname, 'logs/access'),
});

const errorLogStream = rfs.createStream('error.log', {
    interval: '1d', // rotate daily
    path: path.resolve(__dirname, 'logs/error'),
});

morgan.token('error', (req, res) => `${req.error.message || req.error} - ${req.error.stack}`);

const getCustomErrorMorganFormat = () => JSON.stringify({
    method: ':method',
    url: ':url',
    http_version: ':http-version',
    response_time: ':response-time',
    status: ':status',
    content_length: ':res[content-length]',
    timestamp: ':date[iso]',
    headers_count: 'req-headers-length',
    error: ':error',
});

module.exports = { accessLogStream, errorLogStream, getCustomErrorMorganFormat }