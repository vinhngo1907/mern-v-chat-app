const userModel = require("../models/user.model");

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
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ msg: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { fullname, mobile, } = req.body;
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
            const {password, oldPassword} = req.body;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = userController;