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
            // console.log({ users });

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
            console.log(data);
            const client = users.find(u => u.id === data.sender);
            console.log({ client });
            if (client) {
                socket.to(`${client.socketId}`).emit('endCallToClient', data);
                users = editData(users, client.id, null);

                if (client.call) {
                    const clientCall = users.find(u => u.id === client.call)
                    clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data);

                    users = editData(users, client.call, null)
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = callSocketController;