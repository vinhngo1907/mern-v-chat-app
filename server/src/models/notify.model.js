const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    recipients: [{ type: mongoose.Types.ObjectId}],
    text: String,
    content: String,
    image: String,
    url: String,
    isReaded: { type: Boolean, default: false },
},{
    timestamps: true
});

module.exports = mongoose.model("notify", notifySchema);