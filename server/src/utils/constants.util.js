exports.clientUrl = process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : 'https://mern-v-chat-app.netlify.app';


exports.cookieOptions = process.env.NODE_ENV !== "production"
    ? {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
    : {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
