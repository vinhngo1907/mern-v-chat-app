export const apiUrl =
	process.env.NODE_ENV !== 'production'
		? 'http://localhost:5001'
		: 'https://mern-v-chat-app.onrender.com'

export const socketUrl =
	process.env.NODE_ENV !== "production"
		? "http://localhost:5001"
		: "https://mern-v-chat-app.onrender.com"