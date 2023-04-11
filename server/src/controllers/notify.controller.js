const notifyModel = require("../models/notify.model");
const APIFeatures = require("../utils/lib.util");

const notifyController = {
    createNotify: async (req, res) => {
        try {
            const { id, recipients, url, text, content, image } = req.body

            if (recipients.includes(req.user._id.toString())) return;

            const notify = new notifyModel({
                id, recipients, url, text, content, image, user: req.user._id
            })

            await notify.save();
            return res.json({ msg: "Created notify in successfully", notify })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message })
        }
    },
    getAllNotifies: async (req, res) => {
        try {
            const features = new APIFeatures(notifyModel.find({
                recipients: req.user._id
            }).populate("user", "username avatar"), req.query);
            const notifies = await features.query.sort("-createdAt");
            res.status(200).json({ msg: "Get data successfully", notifies });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    removeNotify: async (req, res) => {
        try {
            const removedNotify = await notifyModel.findOneAndDelete({
                _id: req.params.id, url: req.query.url
            });
            if (!removedNotify) {
                return res.status(400).json({ msg: "This notify does not exist", notify: removedNotify })
            }

            res.status(200).json({ msg: "Removed notify in successfully", notify });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await notifyModel.deleteMany({ recipients: req.user._id })

            return res.json({ notifies })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    isReadNotify: async (req, res) => {
        try {
            const updatedNotify = await notifyModel.findOneAndUpdate({
                _id: req.params.id
            }, {
                isReaded: true
            });
            if (!updatedNotify) {
                return res.status(400).json({ msg: "This notifies do not exist" })
            }

            res.status(200).json({ msg: "Updated notifies in successfully", notifies: updatedNotify });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = notifyController;