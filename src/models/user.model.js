const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 25
    },
    fullname: {
        type: String,
        maxLength: 25,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'register' // login, sms
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/v-webdev/image/upload/v1661947123/v-chat-app/profile-user_p2khhu.png'
    },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    gender: {
        type: String,
        default: 'male'
    },
    mobile: {
        type: String,
        default: ''
    }
}, {
    timestamp: true
});

module.exports = mongoose.model('user', UserSchema)