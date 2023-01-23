const userSocketController = require("../socket-controllers/user-socket.controller");

module.exports.defaultSocket = (io, socket, users) => {
    socket.on('disconnect', () => {
        try {
            const data = users.find(user => user.socketId === socket.id);

            if (data) {
                const clients = users.filter(user =>
                    data.following.find(u => u === user.id)
                );
                if (clients.length > 0) {
                    clients.forEach(client =>
                        socket.to(`${client.socketId}`).emit('checkUserOffline', data.id)
                    )
                }
            }
            users = users.filter(user => user.socketId !== socket.id);
        } catch (err) {
            console.log(err);
        }
    });
}