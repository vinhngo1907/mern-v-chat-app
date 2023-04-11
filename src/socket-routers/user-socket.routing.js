const userSocketCtrl = require("../socket-controllers/user-socket.controller");

module.exports.userSocket = (io, socket, users)=>{
    socket.on("joinUser", (data)=>{
        userSocketCtrl.joinUser(io, socket, users, data)
    });
    socket.on("checkUserOnline", (data)=>{
        userSocketCtrl.checkUserOnline(io, socket, users, data);
    });
}