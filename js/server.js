var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
  socket.on('message', function () {console.log("message received"); });
  socket.on('disconnect', function () { });
});