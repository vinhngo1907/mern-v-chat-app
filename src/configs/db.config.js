const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        // all executed methods log output to console
        // mongoose.set('debug', true);

        // disable colors in debug mode
        // mongoose.set('debug', { color: false });

        // get mongodb-shell friendly output (ISODate)
        // mongoose.set('debug', { shell: true });

        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ipawymr.mongodb.net/mern-v-chat-app?retryWrites=true&w=majority`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
        )

        console.log('MongoDB connected');
    } catch (error) {
        console.error("Error: connect:::", error.message)
        process.exit(1);
    }
}

module.exports = connectDB;