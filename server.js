
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
const totalConnection = [];

io.sockets.on('connection', (socket)=> {
    socket.on('new-user-connection', userName => {
        user[socket.id] = userName;
        totalConnection.push(userName);
        console.log('User added, Total number of users in online',totalConnection.length);
        socket.broadcast.emit('user-connected', userName);
    });
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('send-message-to-others', {message:message,userName:user[socket.id]});
    }); 

    sockets.emit('get-online-users', totalConnection);

    socket.on('disconnect', () => {
        if(!user[socket.id]){ return };
        socket.broadcast.emit('user-disconnected', user[socket.id]);
        totalConnection.splice(totalConnection.indexOf(user[socket.id]),1);
        delete user[socket.id];
        socket.emit('get-online-users', totalConnection);
        console.log('User got disconnect, Total number of users in online',totalConnection.length);
    })
});
