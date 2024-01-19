// Node server which will handle socket io connections 
const { Socket } = require('socket.io');

const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket => {
    // If any new user joins, let other users connected to the server Know
    Socket.on('new-user-joined', name => {
        console.log("new user", name)
        users[Socket.id] = name;  // change 'user' to 'users'
        Socket.broadcast.emit('user-joined', name)
    });
    

    // If someone sends a message , broadcast it to other people
    Socket.on('send', message => {
        Socket.broadcast.emit('receive', { message: message, name: users[Socket.id] })
    });

    // Ifsomeone leaves the chat , let others know
    Socket.on('disconnect', message => {
        Socket.broadcast.emit('left', users[Socket.id]);
        delete users[socket.id];
    });
})