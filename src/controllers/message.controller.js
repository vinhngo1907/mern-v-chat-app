const messageModel = require("../models/message.model");
const conversationModel = require("../models/conversation.model");
const userModel = require("../models/user.model");

class APIFeautres {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    paginating() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
const messageController = {
    createMessage: async (req, res) => {
        try {
            const { sender, recipient, text, call, media } = req.body;
            if(!recipient || (!text.trim() && media.length === 0 && !call)) return;

            const users = await userModel.find({ _id: recipient, followers: sender });
            if (users.length < 1) {
                // await userModel
                //     .findOneAndUpdate({ _id: recipient }, { $push: { followers: sender } }, { new: true })
                //     .populate("following followers", "-password");

                // await userModel.findOneAndUpdate({ _id: sender }, { $push: { following: recipient } }, { new: true });
                await Promise.allSettled([
                    userModel.findOneAndUpdate({ _id: recipient }, { $push: { followers: sender } }, { new: true }),
                    userModel.findOneAndUpdate({ _id: sender }, { $push: { following: recipient } }, { new: true })
                ])
            }

            const conversation = await conversationModel.findOneAndUpdate({
                $or: [{ recipients: [sender, recipient] }, { recipients: [recipient, sender] }]

            }, {
                recipients: [sender, recipient],
                text, call, media
            }, { new: true, upsert: true });

            const newMess = await new messageModel({
                conversation: conversation._id, sender, recipient, text, call, media
            });

            await newMess.save();

            res.status(200).json({ msg: "Create success !", message: newMess });
        } catch (error) {
            console.log(error);
            //req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    getMessages: async (req, res) => {
        try {
            const features = new APIFeautres(messageModel.find({
                $or: [
                    { sender: req.user._id, recipient: req.params.id },
                    { sender: req.params.id, recipient: req.user._id }
                ]
            }), req.query).paginating();

            const messages = await features.query.sort("-createdAt");

            res.json({ messages, result: messages.length });
        } catch (error) {
            console.log(error);
            //req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    editMessage: async (req, res) => {
        try {
            const { sender, recipient, media, text, call } = req.body;
            if (sender !== req.user._id) {
                req.error = { message: "You don't have joined this conversation" }
                return res.status(400).json({ msg: "You don't have joined this conversation" });
            }

            const conversation = await conversationModel.findOne({
                $or: [
                    { recipients: [sender, recipient] },
                    { recipients: [recipient, sender] }
                ]
            });
            if (!conversation) {
                req.error = { message: "This conversation not found" }
                return res.status(400).json({ msg: "This conversation not found" });
            }

            const updatedMess = await messageModel.findOneAndUpdate({
                _id: req.params.id, sender: req.user._id, conversation: conversation._id
            }, {
                sender, recipient, media, text, call
            });

            if (!updatedMess) {
                req.error = { message: "This message not found" }
                return res.status(400).json({ msg: "This message not found" });
            }

            res.json({ msg: "Updated message successfully", message: updatedMess });
        } catch (error) {
            console.log(error);
            //req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteMessage: async (req, res) => {
        try {
            const deletedMessage = await messageModel.findOneAndDelete({ _id: req.params.id, sender: req.user._id });
            if (!deletedMessage) {
                req.error = { message: "This message not found" }
                res.status(400).json({ msg: "This message not found" });
            }

            res.json({ msg: "Success", message: deletedMessage });
        } catch (error) {
            console.log(error);
            //req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = messageController;