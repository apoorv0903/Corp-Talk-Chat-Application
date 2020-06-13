//This index.js will act as node server which will handle socket io connections.

const io  = require('socket.io')(8000)  //server will run on port 8000.

const users = {};  // initially user list will be empty.

io.on('connection', socket  =>{
    //if any new user joins, then other user(s) connected to the server knows. 'new-user-joined' is not a build-in event.
socket.on('new-user-joined', name =>{
    // console.log("New user", name);
    users[socket.id]  = name;  //as each user joined the chat it will be assign a unique id. This helps in Scalability.
   
    socket.broadcast.emit('user-joined', name); 
});

//if someone sends a message, boradcast to other users. 'send' is not a built-in event that is used here.
socket.on('send', message =>{
    socket.broadcast.emit('receive', {message: message, name: users[socket.id] })
});

// if someone leaves the chat, let others know. 'disconnect' is a built-in event used here.
socket.on('disconnect', message =>{
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];   // delete the id of the user when leaving the chat.
});

})
