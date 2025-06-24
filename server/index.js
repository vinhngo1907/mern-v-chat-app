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
const io = require("socket.io")(server);
const isProduction = process.env.NODE_ENV === "production";

// ================== DB CONNECT ==================
connectDB();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-client.app'
];

app.use(cors({
    origin: (origin, callback) => {
        // Cho phép requests từ các origin hợp lệ hoặc từ công cụ nội bộ (Postman, curl không có origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// app.use(cors({
//   origin: ["http://localhost:3000"], // Add other allowed origins if needed
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true
// }));

app.use(express.static("public"));

// Morgan logging
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
    SocketServer(socket, io, users); // Modified to allow passing `io` if needed
});

// ================== PEER SERVER ==================
ExpressPeerServer(server, { path: '/' });

// ================== CLIENT PRODUCTION ==================
if (isProduction) {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
