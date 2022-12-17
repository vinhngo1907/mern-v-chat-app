const jwt = require("jsonwebtoken");

exports.JWTConfig = function () {
    this.GenerateKey = async function () {
        try {
            const secret_key = process.env.ACCESS_TOKEN_SECRET;
            if (secret_key) {
                const time = new Date().getTime();
                return jwt.sign(
                    {
                        time: time,
                    },
                    secret_key,
                    {
                        algorithm: "HS256",
                        expiresIn: "1h", //quy dinh thoi gian
                    }
                );
            } else {
                return undefined;
            }
        } catch (err) {
            throw err;
        }
    }
    this.VerifyKey = async function () {
        try {
            const secret_key = process.env.ACCESS_TOKEN_SECRET;
            if (secret_key) {
                const decode = jwt.verify(key, secret_key);
                if (!decode) {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
}