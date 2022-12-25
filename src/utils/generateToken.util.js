const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET,ACTIVE_TOKEN_SECRET } = process.env;

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

exports.generateRefreshToken = (payload, res) => {
    const rf_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    res.cookie('rf_v_token', rf_token, {
        httpOnly: true,
        path: `/api/auth/refresh-token`,
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
    return rf_token;
}

exports.generateActiveToken = (payload) => {
    return jwt.sign(payload, ACTIVE_TOKEN_SECRET, { expiresIn: '5m' });
}