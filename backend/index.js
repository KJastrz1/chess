const express = require('express');
const connectDB = require('./src/config/db');

const swaggerUi = require('swagger-ui-express');
const gameRoutes = require('./src/routes/gameRoutes');

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api/v1', gameRoutes);


const swaggerDocs = require('./src/config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



const http = require('http');
const socketIo = require('socket.io');
// Tworzenie serwera HTTP z aplikacji express
const server = http.createServer(app);

// Konfiguracja socket.io z dodanymi opcjami CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// Obsługa zdarzeń socket.io
io.on('connection', (socket) => {
  console.log('Nowe połączenie');

  socket.on('disconnect', () => {
    console.log('Użytkownik się rozłączył');
  });

  socket.on('joinGame', (room) => {
    socket.join(room);
    console.log(`Użytkownik dołączył do pokoju: ${room}`);
  });

  socket.on('sendMessage', (message, room) => {
    console.log('Otrzymano wiadomość:', message);
    // Emitowanie wiadomości do wszystkich użytkowników w pokoju
    io.to(room).emit('receiveMessage', message);
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

