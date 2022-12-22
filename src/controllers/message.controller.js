const messageModel = require("../models/message.model");
const conversationModel = require("../models/conversation.model");

class APIFeautres {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    paginatin() {
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

            res.status(200).json({ msg: "Create success !" });
        } catch (error) {
            console.log(error);
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
            }), req.query);

            const messages = await features.query.sort("-createdAt");

            res.json({ msg: "Success", messages, result: messages.length });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteMessage: async (req, res) => {
        try {
            const message = await messageModel.findOneAndDelete({ sender: req.user._id, recipient: req.params.id });
            if (!message) {
                res.status(400).json({ msg: "This message not found" });
            }

            res.json({ msg: "Success", message });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = messageController;