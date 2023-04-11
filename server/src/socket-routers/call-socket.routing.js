const callSocketCtrl = require("../socket-controllers/call-socket.controller");

module.exports.callSocket = (io, socket, users) => {
    socket.on("callUser", (data) => {
        callSocketCtrl.callUser(io, socket, users, data);
    });
    socket.on("endCall", (data) => {
        callSocketCtrl.endCall(io, socket, users, data);
    })
}