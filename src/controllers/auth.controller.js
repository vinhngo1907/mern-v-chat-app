const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { validEmail } = require("../validations/valid");
const { generateAccessToken, generateRefreshToken, generateActiveToken } = require("../utils/generateToken.util");
const sendMail = require("../utils/sendMail.util");
const { CLIENT_URL, ACTIVE_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");

const authController = {
    login: async (req, res) => {
        try {
            const { account, password } = { ...req.body };
            const user = await userModel.findOne({
                $or: [
                    { email: account },
                    { username: account }
                ]
            });
            if (!user) {
                req.error = { message: 'User not found or not exist' }
                return res.status(400).json({ msg: 'User not found or not exist' });
            }
            loginUser(user, password, res, req);

        } catch (error) {
            console.log(error);
            req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    register: async (req, res) => {
        try {
            const { fullname, username, email, password } = req.body;
            const user = await userModel.findOne({
                $or: [
                    { email: email },
                    { username: username }
                ]
            }).select("-password");

            // check user
            if (user) {
                req.error = { message: "This username or email is already exist" }
                return res.status(400).json({ msg: "This username or email is already exist" });
            }

            hashedPassword = await bcrypt.hash(password, 12);

            const newUser = {
                fullname, username, email, password: hashedPassword
            }
            const active_token = generateActiveToken(newUser);

            sendMail(email, `${CLIENT_URL}/${active_token}`, "Verify your email address");
            res.status(200).json({ msg: "Register Success! Please check email." });

        } catch (error) {
            console.log(error);
            req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    activeAccount: async (req, res) => {
        try {
            const { active_token } = req.body;
            const userData = jwt.verify(active_token, ACTIVE_TOKEN_SECRET);
            if (!userData) {
                return res.status(400).json({ msg: "Authenticated faild, please try again." })
            }
            registerUser(userData, res);
        } catch (error) {
            console.log(error);
            req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
        } catch (error) {
            console.log(error);
            req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    refreshToken: async (req, res) => {
        try {
            // console.log(req.cookies.rf_v_token);
            const rf_token = req.cookies.rf_v_token;
            if (!rf_token) {
                req.error = { message: 'Refresh token not found!' }
                return res.status(401).json({ msg: 'Refresh token not found!' });
            }

            const decoded = jwt.verify(rf_token, REFRESH_TOKEN_SECRET);
            if (!decoded) {
                req.error = { message: 'Please login!' }
                return res.status(401).json({ msg: 'Please login!' });
            }

            const user = await userModel.findOne({ _id: decoded.userId }).select("-password");
            if (!user) {
                req.error = { message: 'Authenticated failure, please login again!' }
                return res.status(401).json({ msg: 'Authenticated failure, please login again!' });
            }
            const access_token = generateAccessToken({ userId: user._id });
            generateRefreshToken({ userId: user._id }, res);

            res.status(200).json({
                msg: "Success",
                user: user._doc,
                access_token
            })

        } catch (error) {
            console.log(error);
            req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('rf_v_token', { path: '/api/auth/refresh-token' });
            return res.json({ msg: "Logout success" });
        } catch (error) {
            req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    }
}

async function loginUser(user, password, res, req) {
    try {
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
            let msgError = "";
            msgError = (user.type === "register")
                ? msgError = "Password is incorrect"
                : msgError = `Password is incorrect. This account login with ${user.type}`;

            req.error = { message: msgError }
            return res.status(400).json({ msg: msgError });
        }

        generateRefreshToken({ userId: user._id }, res);
        const access_token = generateAccessToken({ userId: user._id });

        res.json({
            msg: "Logged in successfully",
            user: { ...user._doc, password: "" },
            access_token
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

async function registerUser(user, res) {
    try {
        const newUser = await new userModel({ ...user });
        await newUser.save();
        generateRefreshTokenSecret({ userId: newUser._id });

        const access_token = generateRefreshTokenSecret({ userId: newUser._id });
        res.status(200).json({
            msg: "Register in successfully",
            user: { ...newUser._doc, password: "" },
            access_token
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = authController;