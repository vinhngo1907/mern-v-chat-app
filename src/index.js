require('dotenv').config()
const express = require('express');
const connectDB = require("./configs/db.config");
const cors = require('cors');
const helmet = require("helmet");

// const authRouter = require('./routes/auth')
// const postRouter = require('./routes/post')

connectDB();

// Middlewares
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes
require("./routes/index.routing")(app);
// app.use('/api/auth', authRouter)
// app.use('/api/posts', postRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));