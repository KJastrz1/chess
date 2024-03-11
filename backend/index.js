const express = require('express');
const connectDB = require('./src/config/db');

const swaggerUi = require('swagger-ui-express');
const gameRoutes = require('./src/routes/gameRoutes');
const userRoutes = require('./src/routes/UserRoutes');
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//ROUTES
app.use('/api/v1', gameRoutes);
app.use('/api/v1/users', userRoutes);


//SWAGGER
const swaggerDocs = require('./src/config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



//SOCKET
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

require('./src/socket')(io);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

