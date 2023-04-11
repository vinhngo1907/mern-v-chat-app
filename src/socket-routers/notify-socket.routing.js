const notifySocketCtrl = require("../socket-controllers/notify-socket.controller");

module.exports.notifySocket = (io, socket, users) => {
    socket.on("createNotify", (data) => {
        notifySocketCtrl.createNotify(io, socket, users, data);
    });
    socket.on("removeNotify", (data) => {
        notifySocketCtrl.removeNotify(io, socket, users, data);
    })
}