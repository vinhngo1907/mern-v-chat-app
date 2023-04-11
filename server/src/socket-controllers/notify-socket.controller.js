const notifySocketController = {
    createNotify: async (io, socket, users, msg) => {
        try {
            console.log(">>>>>>>", { msg });
            const client = users.find(user => msg.recipients.includes(user.id));
            console.log({ client })
            client && socket.to(`${client.socketId}`).emit("createNotifyToClient", msg)

        } catch (err) {
            console.log(err);
        }
    },

    removeNotify: async (io, socket, users,) => {
        try {
            const client = users.find(user => msg.recipients.includes(user.id))
            client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = notifySocketController;