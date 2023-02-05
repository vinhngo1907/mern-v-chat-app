const editData = (data, id, call) => {
    const newData = data.map((item) => item.id === id ? { ...item, call } : item);
    return newData;
}

const callSocketController = {
    callUser: async (io, socket, users, data) => {
        // users.push({ id: user._id, socketId: socket.id, followers: user.followers });
        console.log({ data });
        try {
            users = editData(users, data.sender, data.recipient);
            console.log({ users });
            
            const client = users.find(u => u.id === data.recipient);
            if (client) {
                if (client.call) {
                    socket.emit('userBusy', data);
                    users = editData(users, data.sender, null);

                } else {
                    users = editData(users, data.recipient, data.sender);
                    socket.to(`${client.socketId}`).emit('callUserToClient', data);
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    endCall: async (io, socket, users, data) => {
        try {

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = callSocketController;