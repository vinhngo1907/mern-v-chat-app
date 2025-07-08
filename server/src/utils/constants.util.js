exports.clientUrl = process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : 'https://mern-v-chat-app.netlify.app'