const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const activeRooms = {};

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    
    socket.on('join-room', (data) => {
        const { room, name } = data;
        
        socket.join(room);
        socket.room = room;
        socket.name = name; 

        if (!activeRooms[room]) {
            activeRooms[room] = {};
        }

        activeRooms[room][socket.id] = { id: socket.id, name: name }; 
        console.log(`User '${name}' (${socket.id}) joined room '${room}'`);
        
        io.to(room).emit('update-user-list', Object.values(activeRooms[room]));
    });

    socket.on('drawing', (data) => {
        if (socket.room) {
            socket.to(socket.room).emit('drawing', data);
        }
    });
    
    socket.on('clear', () => {
        if (socket.room) {
            io.to(socket.room).emit('clear');
        }
    });

    socket.on('cursor-move', (data) => {
        if (socket.room) {
            socket.to(socket.room).emit('cursor-move', { id: socket.id, ...data });
        }
    });

    socket.on('disconnect', () => {
        const roomName = socket.room;
        if (roomName && activeRooms[roomName]) {
            console.log(`User '${socket.name}' (${socket.id}) disconnected from room '${roomName}'`);
            delete activeRooms[roomName][socket.id];
            
            if (Object.keys(activeRooms[roomName]).length === 0) {
                delete activeRooms[roomName];
            } else {
                io.to(roomName).emit('update-user-list', Object.values(activeRooms[roomName]));
            }
        }
        io.to(roomName).emit('user-disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});