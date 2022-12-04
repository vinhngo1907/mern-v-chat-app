const authRouter = require("./auth.routing");
const userRouter = require("./user.routing");
const messageRouter = require("./message.routing");
const baseURL = '/api';

function createRouter(app) {
    app.use(baseURL + '/auth', authRouter);
    app.use(baseURL + '/user', userRouter);
    app.use(baseURL + '/message', messageRouter);
}

module.exports = createRouter;