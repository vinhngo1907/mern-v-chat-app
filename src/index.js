require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db.config");
const cors = require('cors');
const helmet = require("helmet");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");
const { accessLogStream, errorLogStream, getCustomErrorMorganFormat } = require("./configs/morgan.config");
const { defaultSocket } = require("./socket-routers/index.routing");
const { userSocket } = require("./socket-routers/user-socket.routing");
const { messageSocket } = require("./socket-routers/message-socket.routing");
const { callSocket } = require("./socket-routers/call-socket.routing");

// connect DB
connectDB();

// Middlewares
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());
const isProduction = process.env.NODE_ENV === "production";

// morgan - logger
morgan.token('error', (req, res) => `${req?.error?.message || req?.error?.err} - ${req?.error?.stack}`);

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
require("./routes/index.routing")(app);

// socket
let users = [];
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const onConnection = async (socket) => {
    
    console.log("new connection");
    
    // User join - online
    userSocket(io, socket, users);
    
    // Message
    messageSocket(io, socket, users);
    
    // Call user
    callSocket(io, socket, users);
    
    // User disconnect - offline
    defaultSocket(io, socket, users);
}

io.on("connection", onConnection);


if (isProduction) {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"))
    });
}

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));