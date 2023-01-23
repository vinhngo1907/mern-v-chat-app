const callSocketController = require("../socket-controllers/call-socket.controller");

module.exports.callSocket = (io, socket, users)=>{
    socket.on("callUser", (data)=>{
        callSocketController.callUser(io, socket, users, data.sender, data.recipient)
    })
}