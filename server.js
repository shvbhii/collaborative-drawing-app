const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Object to store information about active users
const activeUsers = {};

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Add new user to our list
    activeUsers[socket.id] = { id: socket.id };

    // Emit the updated user list to ALL clients
    io.emit('update-user-list', Object.values(activeUsers));

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });
    
    socket.on('clear', () => {
        io.emit('clear');
    });

    socket.on('cursor-move', (data) => {
        // Broadcast the cursor data to all other clients, including the user's ID
        socket.broadcast.emit('cursor-move', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove user from our list
        delete activeUsers[socket.id];

        // Emit the updated user list to ALL clients
        io.emit('update-user-list', Object.values(activeUsers));
        
        // Also emit the original user-disconnected event for cursor cleanup
        io.emit('user-disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});