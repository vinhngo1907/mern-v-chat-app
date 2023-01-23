const userSocketController = {
    joinUser: async (io, socket, users, user) => {
        try {
            users.push({ id: user._id, socketId: socket.id, followers: user.followers });
        } catch (err) {
            console.log(err);
        }
    },
    checkUserOnline: async (io, socket, users, data) => {
        try {
            // console.log(users);
            // console.log(data.following);
            const clients = users.filter(user => data.following.find(u => u === user.id));
            // console.log(">>>>> clients",clients)

            socket.emit("checkUserOnlineToMe", clients);

            if (clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = userSocketController;