const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

app.use(cors());

const server = require('http').createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});

io.on('connection',(socket) => {
    socket.emit('me', socket.id);


    socket.on('disconnect',() => {
        socket.broadcast.emit('callended');
    })

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from, name: data.name});
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('acceptedCall', data.signal);
    })
})

const PORT = process.env.PORT || 5000;



server.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`)
})