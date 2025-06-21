
# 📱 mern-v-chat-app

> **This project is currently in development.**

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) with potential features such as private messaging, group chat, and presence indicators.

---

## 🚀 Features (Planned / In Progress)

- [x] User authentication (JWT + Cookies)
- [x] RESTful APIs with Express.js
- [ ] Real-time messaging via WebSocket (Socket.io)
- [ ] 1-on-1 private chat
- [ ] Group chat support
- [ ] Online/offline user status
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File/media sharing
- [ ] Push notifications
- [ ] Dark mode UI

---

## 🛠 Tech Stack

| Frontend | Backend         | Database       | Realtime   |
|----------|------------------|----------------|------------|
| React    | Node.js + Express | MongoDB Atlas  | Socket.io  |

---

## 🧑‍💻 Local Development Setup

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/mern-v-chat-app.git
cd mern-v-chat-app
```

### 2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Create `.env` files for both `client` and `server`:
#### Example `.env` for server:
```env
PORT=3001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-v-chat
JWT_SECRET=your_jwt_secret
```

#### Example `.env` for client:
```env
REACT_APP_API_URL=http://localhost:3001
```

### 4. Run the app:
```bash
# Terminal 1 (backend)
cd server
npm run dev

# Terminal 2 (frontend)
cd client
npm start
```

---

## 📦 Deployment Plan

- [ ] Docker support
- [ ] Deploy backend on Render / Railway / Vercel
- [ ] Deploy frontend via Netlify / Vercel
- [ ] Configure environment variables for production

---

## 📋 TODO

You can track progress in [`TASKS.md`](./TASKS.md).

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

## ✨ Contributors

> Coming soon...
