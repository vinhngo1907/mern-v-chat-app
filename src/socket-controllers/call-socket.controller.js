const editData = (data, id, call) => {
    const newData = data.map((item) => item.id === id ? { ...item, call } : item);
    return newData;
}

const callSocketController = {
    callUser: async (io, socket, users, sender, recipient) => {
        // users.push({ id: user._id, socketId: socket.id, followers: user.followers });
    }
}

module.exports = callSocketController;