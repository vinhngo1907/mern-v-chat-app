const messageSocketController = require("../socket-controllers/message-socket.controller");

module.exports.messageSocket = (io, socket, users)=>{
    socket.on("addMessage", (data)=>{
        messageSocketController.addMessage(io, socket, users, data)
    });
    socket.on("deleteMessage", (data)=>{
        messageSocketController.deleteMessage(io, socket, users, data);
    });
}