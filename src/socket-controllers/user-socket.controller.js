const userSocketController = {
    joinUser: async (io, socket, users, user) => {
        users.push({ id: user._id, socketId: socket.id, followers: user.followers });
    }
}

module.exports = userSocketController;