const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Puerto predeterminado de Vite
    methods: ['GET', 'POST']
  }
});

app.use(cors());

// Eventos de Socket.IO para señalización
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);
  });

  socket.on('offer', (roomId, offer) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', (roomId, answer) => {
    socket.to(roomId).emit('answer', answer);
  });

  // Manejo de candidatos ICE
  socket.on('candidate', (roomId, candidate) => {
    socket.to(roomId).emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Servidor escuchando en el puerto 5000');
});
