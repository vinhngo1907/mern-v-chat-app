const jwt = require("jsonwebtoken");
const { cookieOptions } = require("./constants.util");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET,ACTIVE_TOKEN_SECRET } = process.env;

exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

exports.generateRefreshToken = (payload, res) => {
    const rf_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    // res.cookie('rf_v_token', rf_token, {
    //     httpOnly: true,
    //     path: `/api/auth/refresh-token`,
    //     maxAge: 1 * 24 * 60 * 60 * 1000
    // })
    
    res.cookie('rf_v_token', rf_token, cookieOptions)
    return rf_token;
}

exports.generateActiveToken = (payload) => {
    return jwt.sign(payload, ACTIVE_TOKEN_SECRET, { expiresIn: '5m' });
}