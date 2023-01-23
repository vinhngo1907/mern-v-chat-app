const messageSocketController = {
    addMessage: async (io, socket, users, data) => {
        console.log(users)
        const user = users.find(user => user.id === data.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', data)
    },
    editMessage: async(io, socket, users, data)=>{
        
    },
    deleteMessage: async (io, socket, users, data) =>{
        
    }
}

module.exports = messageSocketController;