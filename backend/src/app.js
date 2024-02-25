const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Handle game events, e.g., a move made by a player
  socket.on('moveMade', (move) => {
    // Broadcast the move to the other player
    socket.broadcast.emit('moveMade', move);
  });
});

// Use server to listen instead of the app
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
