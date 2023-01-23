const userSocketCtrl = require("../socket-controllers/user-socket.controller");

module.exports.defaultSocket = (io, socket, users) => {
    socket.on('disconnect', () => {
        // const data = users.find(user => user.socketId === socket.id);

        // if (data) {
        //     const clients = users.filter(user =>
        //         data.following.find(u => u === user.id)
        //     );
        //     if (clients.length > 0) {
        //         clients.forEach(client =>
        //             socket.to(`${client.socketId}`).emit('checkUserOffline', data.id)
        //         )
        //     }
        // }
        userSocketCtrl.checkUserOffline(io, socket, users);
        users = users.filter(user => user.socketId !== socket.id);
    });
}