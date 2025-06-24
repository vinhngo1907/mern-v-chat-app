const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");
const APIFeautres = require("../utils/lib.util");

// class APIFeautres {
//     constructor(query, queryStr) {
//         this.query = query;
//         this.queryStr = queryStr;
//     }

//     paginatin() {
//         const page = this.queryStr.page * 1 || 1;
//         const limit = this.queryStr.limit * 1 || 9;
//         const skip = (page - 1) * limit;
//         this.query = this.query.skip(skip).limit(limit);
//         return this;
//     }
// }

const conversationController = {
    getConversation: async (req, res) => {
        try {
            const features = new APIFeautres(conversationModel.find({ recipients: req.user._id }), req.query);
            const conversations = await features.query.sort('-updatedAt').populate("recipients", "avatar fullname username email mobile address createdAt");

            res.json({ msg: "Success", conversations, result: conversations.length });
        } catch (error) {
            console.log(error);
            //req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const conversation = await conversationModel.findOneAndDelete({
                $or: [
                    { recipients: [req.user._id, req.params.id] },
                    { recipients: [req.params.id, req.user._id] }
                ]
            });
            if (!conversation) {
                return res.status(400).json({ msg: "This conversation not found" });
            }
            await messageModel.deleteMany({ conversation: conversation._id });
            res.status(200).json({ msg: "Deleted conversation successfully" });
        } catch (error) {
            console.log(error);
            //req.error = error;
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = conversationController