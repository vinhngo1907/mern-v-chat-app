const userSocketController = require("../socket-controllers/user-socket.controller");

module.exports.userSocket = (io, socket, users)=>{
    socket.on("joinUser", (data)=>{
        userSocketController.joinUser(io, socket, users, data)
    });
    socket.on("checkUserOnline", (data)=>{
        userSocketController.checkUserOnline(io, socket, users, data);
    })
}