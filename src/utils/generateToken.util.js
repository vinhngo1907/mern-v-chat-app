const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}

exports.generateRefreshTokenSecret = (payload) => {
    const rf_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    res.cookies('refresh_token', rf_token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: "/api/auth/refresh-token",
        httpOnly: true
    })
    return rf_token;
}

exports.generateActiveTokenSecret = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '5m' });
}