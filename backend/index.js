const express = require('express');
const connectDB = require('./src/config/db');
const swaggerJsdoc = require('swagger-jsdoc');
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

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Chess Game API',
      version: '1.0.0',
      description: 'API for online chess game',
    },
  },

  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('joinGame', (gameId) => {
    socket.join(gameId);

    socket.on('move', (move) => {
      io.to(gameId).emit('move', move);
    });

    socket.on('leaveGame', () => {
      socket.leave(gameId);
    });
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
