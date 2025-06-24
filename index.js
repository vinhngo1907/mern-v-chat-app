require('dotenv').config({path: "./.env"});
const express = require('express');
const cookieParser = require("cookie-parser");
const connectDB = require("./src/configs/db.config");
const cors = require('cors');
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { accessLogStream, errorLogStream, getCustomErrorMorganFormat, errorsLog } = require("./src/configs/morgan.config");
// const { defaultSocket } = require("./src/socket-routers/index.routing");
// const { userSocket } = require("./src/socket-routers/user-socket.routing");
// const { messageSocket } = require("./src/socket-routers/message-socket.routing");
// const { callSocket } = require("./src/socket-routers/call-socket.routing");
// const { notifySocket } = require("./src/socket-routers/notify-socket.routing");
const { ExpressPeerServer } = require('peer');
const SocketServer = require('./src/socketServer');

// connect DB
connectDB();

// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.static("public"));
const isProduction = process.env.NODE_ENV === "production";

// morgan - logger
// morgan.token('error', (err, req, res, next) => `${req?.error?.message || req?.error?.err} - ${req?.error?.stack}`);
morgan.token('error', (err, req, res, next) => `${err?.stack}`);

app.use(
    morgan(getCustomErrorMorganFormat(), {
        skip: (req, res) => (res.statusCode < 400),
        stream: errorLogStream,
    })
);

app.use(
    !isProduction ? morgan('combined', { stream: accessLogStream, }) : morgan("dev")
);

// Routes
require("./src/routes/index.routing")(app);

// socket
let users = [];
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// const onConnection = async (socket) => {

//     console.log("new connection");

//     // User join - online
//     userSocket(io, socket, users);

//     // Message
//     messageSocket(io, socket, users);

//     // Call user
//     callSocket(io, socket, users);

//     // Notification
//     notifySocket(io, socket, users);

//     // User disconnect - offline
//     defaultSocket(io, socket, users);
// }


// io.on("connection", onConnection);
io.on("connection", socket => {
    SocketServer(socket);
});
// Create peer server
ExpressPeerServer(http, { path: '/' });

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));