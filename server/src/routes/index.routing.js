const authRouter = require("./auth.routing");
const userRouter = require("./user.routing");
const messageRouter = require("./message.routing");
const conversationRouter = require("./conversation.routing");
const notificationRouter = require("./notify.routing");
const baseURL = '/api';

function createRouter(app) {
    // app.use('/', (req, res) => {
    //     console.log("Hello CodersX Tokyo");
    //     res.status(200).send('Hello Word!');
    // })
    app.use(baseURL + '/auth', authRouter);
    app.use(baseURL + '/user', userRouter);
    app.use(baseURL + '/message', messageRouter);
    app.use(baseURL + '/conversation', conversationRouter);
    app.use(baseURL + '/notification', notificationRouter);
}

module.exports = createRouter;