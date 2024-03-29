const messageSocketController = {
    addMessage: async (io, socket, users, data) => {
        try {
            console.log("Add mess",{users});
            const user = users.find(user => user.id === data.recipient)
            user && socket.to(`${user.socketId}`).emit('addMessageToClient', data);
        } catch (err) {
            console.log(err);
        }
    },
    editMessage: async (io, socket, users, data) => {
        try {
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    },
    deleteMessage: async (io, socket, users, data) => {
        try {
            console.log(">>>>>>>> Delete mess", data);
            const user = users.find(user => user.id === data.recipient);
            // console.log({user})
            user && socket.to(`${user.socketId}`).emit('deleteMessageToClient', data);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = messageSocketController;