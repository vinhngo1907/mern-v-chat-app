const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIFeatures = require("../utils/lib.util");

// class APIFeatures {
//     constructor(query, queryStr) {
//         this.query = query;
//         this.queryStr = queryStr;
//     }
//     paginating() {
//         const page = this.queryStr.page * 1 || 1;
//         const limit = this.queryStr.limit * 1 || 2;
//         const skip = (page - 1) * limit;
//         this.query = this.query.skip(skip).limit(limit);
//         return this;
//     }
// }
const userController = {
    getMe: async (req, res) => {
        try {
            const user = req.user;
            res.status(200).json({ msg: "Success", user });
        } catch (error) {
            console.log(error);
            // req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params.id }).select("-password -rf_token");
            if (!user) return res.status(400).json({ msg: "User not found" });

            res.status(200).json({ msg: "Success", user });
        } catch (error) {
            console.log(error);
            // req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { avatar, fullname, mobile, address, gender } = req.body;
            if (!fullname && !avatar) {
                req.error = { message: "Please add your full name or avatar." }
                return res.status(400).json({ msg: "Please add your full name or avatar." });
            }

            let updatedUser = {
                avatar, fullname, mobile, address, gender
            }

            updatedUser = await userModel.findOneAndUpdate({ _id: req.user._id }, updatedUser, { new: true });
            if (!updatedUser) {
                req.error = { message: "User not found or not authorized" }
                return res.status(400).json({ msg: "User not found or not authorized" });
            }
            res.status(200).json({ msg: "Updated user successfully" });
        } catch (error) {
            console.log(error);
            // req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    changePassword: async (req, res) => {
        try {
            const userId = req.user._id;
            const user = await userModel.findById(userId);

            const { password, oldPassword } = req.body;
            const validPass = await bcrypt.compare(oldPassword, user.password);
            if (!validPass) {
                req.error = { message: "Old password not correct" }
                return res.status(400).json({ msg: "Old password not correct" });

            }
            const hashedPass = await bcrypt.hash(password, 10);
            await userModel.findOneAndUpdate({ _id: userId }, { password: hashedPass }, { new: true, runValidators: true });
            res.status(200).json({ msg: "Update password successfully" });
        } catch (error) {
            console.log(error);
            // req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    search: async (req, res) => {
        try {
            const { username, fullname } = req.query;
            let queryArr = []

            if (username) {
                queryArr.push({ username: { $regex: username, $options: "i" } })
            }

            if (fullname) {
                queryArr.push({ fullname: { $regex: fullname, $options: "i" } })
            }


            let queryObj = queryArr.length >= 1 ? { "$or": queryArr } : {}

            const features = new APIFeatures(userModel.find({
                ...queryObj
            }).select("username fullname avatar"), req.query).paginating();


            const check = await Promise.allSettled([userModel.find({
                ...queryObj
            })]);
            const result = check[0].status === 'fulfilled' ? check[0].value : []
            const users = await features.query.sort("-createdAt").select("username fullname avatar")

            // const result = await features.query;
            res.status(200).json({
                msg: "Success",
                users,
                result: users.length,
                total: result.length
            })
        } catch (error) {
            console.log(error);
            // req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            if (!req.user) {
                req.error = { message: "Please login right now!" }
                return res.status(400).json({ msg: "Please login right now!" });
            }
            const password = await bcrypt.hash(req.body.password, 10);
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, {
                password: password
            }, { new: true });

            res.status(200).json({ msg: "Reset password success" })
        } catch (error) {
            console.log(error);
            // req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = userController;