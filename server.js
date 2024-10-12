const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, JS) for mobile and desktop apps
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New connection established');

  socket.on('start-file', (fileMetadata) => {
    // Broadcast file metadata to all connected clients except the sender
    socket.broadcast.emit('start-file', fileMetadata);
  });

  socket.on('file-chunk', (chunk) => {
    // Broadcast file chunk to all connected clients except the sender
    socket.broadcast.emit('file-chunk', chunk);
  });

  socket.on('end-file', () => {
    // Broadcast end of file to all connected clients except the sender
    socket.broadcast.emit('end-file');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
