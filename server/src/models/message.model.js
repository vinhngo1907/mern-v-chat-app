const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	conversation: {
		type: mongoose.Types.ObjectId,
		ref: 'conversation'
	},
	sender: { type: mongoose.Types.ObjectId, ref: 'user' },
	recipient: { type: mongoose.Types.ObjectId, ref: 'user' },
	media: Array,
	text: String,
	call: Object

}, {
	timestamps: true
})

module.exports = mongoose.model('message', messageSchema)
