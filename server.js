


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static(__dirname));


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    
    socket.on('drawing', (data) => {
        
        socket.broadcast.emit('drawing', data);
    });
    
    
    socket.on('clear', () => {
        
        io.emit('clear');
    });

    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});