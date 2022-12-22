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
    getConversation: async (req, res) => {
        try {
            const features = new APIFeautres(conversationModel.find({ recipients: req.user._id }), req.query);
            const conversations = await features.query.sort('-updated').populate("recipients", "avatar fullname username");

            res.json({ msg: "Success", conversations, result: conversations.length });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    getMessages: async (req, res) => {
        try {
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = messageController;