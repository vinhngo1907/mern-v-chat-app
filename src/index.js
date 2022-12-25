require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db.config");
const cors = require('cors');
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { accessLogStream, errorLogStream, getCustomErrorMorganFormat } = require("./configs/morgan.config")

// const authRouter = require('./routes/auth')
// const postRouter = require('./routes/post')

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
app.use(
    morgan(getCustomErrorMorganFormat(), {
        skip: (req, res) => (res.statusCode < 400),
        stream: errorLogStream,
    })
);

app.use(
    isProduction ? morgan('combined', { stream: accessLogStream, }) : morgan("dev")
);

// Routes
require("./routes/index.routing")(app);
// app.use('/api/auth', authRouter)
// app.use('/api/posts', postRouter)

if (isProduction) {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"))
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));