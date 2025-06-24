require('dotenv').config({ path: "./.env" });
const express = require('express');
const cookieParser = require("cookie-parser");
const connectDB = require("./src/configs/db.config");
const cors = require('cors');
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const { ExpressPeerServer } = require('peer');
const SocketServer = require('./src/socketServer');
const {
    accessLogStream,
    errorLogStream,
    getCustomErrorMorganFormat
} = require("./src/configs/morgan.config");

// ================== INIT ==================
const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === "production";

// ================== CORS CONFIG ==================
const allowedOrigins = [
    'http://localhost:3000',
    'https://mern-v-chat-app.netlify.app'
];

// ================== SOCKET.IO with CORS ==================
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    }
});

// ================== DB CONNECT ==================
connectDB();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.options('*', cors());
app.use(express.static("public"));

// ================== LOGGING ==================
morgan.token('error', (err) => `${err?.stack || ''}`);
app.use(morgan(getCustomErrorMorganFormat(), {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLogStream,
}));
app.use(!isProduction ? morgan('combined', { stream: accessLogStream }) : morgan("dev"));

// ================== ROUTES ==================
require("./src/routes/index.routing")(app);

// ================== SOCKET ==================
let users = [];
io.on("connection", (socket) => {
    SocketServer(socket, io, users); // Pass io if needed
});

// ================== PEER ==================
ExpressPeerServer(server, { path: '/' });

// ================== CLIENT STATIC (React build) ==================
if (isProduction) {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// ================== START ==================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
