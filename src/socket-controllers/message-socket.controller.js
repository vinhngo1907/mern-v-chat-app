const messageSocketController = {
    addMessage: async (io, socket, users, data) => {
        try {
            // console.log(users);
            const user = users.find(user => user.id === data.recipient)
            user && socket.to(`${user.socketId}`).emit('addMessageToClient', data);
        } catch (err) {
            console.log(err);
        }
    },
    editMessage: async (io, socket, users, data) => {

    },
    deleteMessage: async (io, socket, users, data) => {

    }
}

module.exports = messageSocketController;