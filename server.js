
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/public'));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running at ${PORT}`));

app.get('/' , (req, res) => {
    res.sendFile('/index.html');
});
const user = {};

io.sockets.on('connection', (socket)=> {
    socket.on('new-user-connection', userName => {
        user[socket.id] = userName;
        socket.broadcast.emit('user-connected', userName);
    });
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('send-message-to-others', {message:message,userName:user[socket.id]});
    }); 

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', user[socket.id]);
        delete user[socket.id];
    })
})