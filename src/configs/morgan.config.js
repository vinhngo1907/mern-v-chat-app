const rfs = require("rotating-file-stream");
const path = require("path");
const moment = require('moment-timezone');
const fs = require("fs");

const currentDate = () => {
    const format = 'MMM-DD-YYYY HH:mm:ss';
    const timezone = 'Asia/Ho_Chi_Minh';
    
    const now = moment().tz(timezone).format(format);
    return now;
}

const accessLogStream = rfs.createStream(`access.log`, {
    interval: '1d', // rotate daily
    path: path.join('./src/', 'logs/access'),
});

const errorLogStream = rfs.createStream(`error.log`, {
    interval: '1d', // rotate daily
    path: path.join('./src/', 'logs/error'),
});

// const errorsLog = fs.createWriteStream(path.join('./src/', 'error.log'), { flags: 'a' });
// morgan.token('error', (req, res) => `${req.error.message} - ${req.error.stack}`);

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