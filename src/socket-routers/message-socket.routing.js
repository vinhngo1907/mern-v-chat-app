const messageSocketCtrl = require("../socket-controllers/message-socket.controller");

module.exports.messageSocket = (io, socket, users) => {
    socket.on("addMessage", (data) => {
        messageSocketCtrl.addMessage(io, socket, users, data);
    });
    socket.on("editMessage", (data) => {
        messageSocketCtrl.editMessage(io, socket, users, data);
    })
    socket.on("deleteMessage", (data) => {
        messageSocketCtrl.deleteMessage(io, socket, users, data);
    });
}