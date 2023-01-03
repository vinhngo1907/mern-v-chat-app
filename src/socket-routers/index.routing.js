module.exports.defaultSocket = (io, socket, users) => {
    socket.on('disconnect', () => {
        const data = users.find(user => user.socketId === socket.id);
        users = users.filter(user => user.socketId !== socket.id)
    })
}