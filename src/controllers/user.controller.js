const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const userController = {
    getMe: async (req, res) => {
        try {
            const user = req.user;
            res.status(200).json({ msg: "Success", user });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ msg: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params.id }).select("-password -rf_token");
            if (!user) return res.status(400).json({ msg: "User not found" });
            
            res.status(200).json({ msg: "Success", user });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ msg: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { fullname, mobile, avatar} = req.body;
            let updatedUser = {
                fullname, mobile
            }
            updatedUser = await userModel.findOneAndUpdate({ _id: req.params.id }, updatedUser, { new: true });
            if (!updatedUser) {
                return res.status(400).json({ msg: "User not found or not authorized" });
            }
            res.status(200).json({ msg: "Updated user successfully" });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ msg: error.message });
        }
    },
    changePassword: async (req, res) => {
        try {
            const userId = req.user._id;
            const user = await userModel.findById(userId);

            const { password, oldPassword } = req.body;
            const validPass = await bcrypt.compare(oldPassword, user.password);
            if (!validPass) return res.status(400).json({ msg: "old password not correct" });

            const hashedPass = await bcrypt.hash(password, 10);
            await userModel.findOneAndUpdate({ _id: userId }, { password: hashedPass }, { new: true, runValidators: true });
            res.status(200).json({ msg: "Update password successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = userController;