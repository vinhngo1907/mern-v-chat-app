const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { validEmail } = require("../validations/valid");
const { generateActiveTokenSecret, generateAccessToken, generateRefreshTokenSecret } = require("../utils/generateToken.util");
const sendMail = require("../utils/sendMail.util");
const { CLIENT_URL, ACTIVE_TOKEN_SECRET } = process.env;

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
            if (user) {
                loginUser(user, password, res);
            }
            return res.status(400).json({ msg: 'User not found or not exist' });

        } catch (error) {
            console.log(error);
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
                return res.status(400).json({ msg: "This username or email is already exist" });
            }

            hashedPassword = await bcrypt.hash(password, 12);

            const newUser = {
                fullname, username, email, password: hashedPassword
            }
            const active_token = generateActiveTokenSecret(newUser);

            sendMail(email, `${CLIENT_URL}/${active_token}`, "Verify your email address");
            res.status(200).json({ msg: "Register Success! Please check email." });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    activeAccount: async (req, res) => {
        try {
            const { active_token } = req.body;
            const userData = jwt.verify(active_token, ACTIVE_TOKEN_SECRET);
            if (!userData) {

            }
            registerUser(userData, res);
        } catch (error) {
            return res.status(500).json({ msg: "Internal server error" });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
        } catch (error) {
            return res.status(500).json({ msg: "Internal server error" });
        }
    },
}

async function loginUser(user, password, res) {
    try {
        const isValidPass = await bcrypt.compare(user.password, password);
        if (!isValidPass) {
            return res.status(400).json({ msg: "Password is incorrect" });
        }
        
        generateRefreshTokenSecret({ userId: user._id });
        const access_token = generateAccessTokenSecret({ userId: user._id });

        res.status(200).json({
            msg: "Logged in successfully",
            user: { ...user._doc, password: "" },
            access_token
        })
    } catch (error) {
        throw Error(error);
    }
}

async function registerUser(user, res) {
    try {
        const newUser = await new userModel({ ...userData });
        await newUser.save();
        generateRefreshTokenSecret({ userId: newUser._id });

        const access_token = generateRefreshTokenSecret({ userId: newUser._id });
        res.status(200).json({
            msg: "Register in successfully",
            user: { ...newUser._doc, password: "" },
            access_token
        });
    } catch (error) {
        throw Error(error);
    }
}

module.exports = authController;