const authRouter = require("./auth.routing");
const userRouter = require("./user.routing");
const messageRouter = require("./message.routing");
const conversationRouter = require("./conversation.routing");
const notificationRouter = require("./notify.routing");
const uploadRouter = require("./upload.routing");
const baseURL = '/api';

function createRouter(app){ 
    app.use(baseURL + '/auth', authRouter);
    app.use(baseURL + '/user', userRouter);
    app.use(baseURL + '/message', messageRouter);
    app.use(baseURL + '/conversation', conversationRouter);
    app.use(baseURL + '/notification', notificationRouter);
    app.use(baseURL + '/upload', uploadRouter);
}

module.exports = createRouter;