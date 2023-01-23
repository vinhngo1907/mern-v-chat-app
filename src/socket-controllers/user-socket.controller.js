const userSocketController = {
    joinUser: async (io, socket, users, user) => {
        users.push({ id: user._id, socketId: socket.id, followers: user.followers });
    },
    checUserOnline: async(io, socket, users, data)=>{
        // const following = users.filter(user=>data.following.find()); 
    }
}

module.exports = userSocketController;