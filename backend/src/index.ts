import 'module-alias/register';
import express from 'express';
import connectDB from './config/db';
import swaggerUi from 'swagger-ui-express';
import gameRoutes from './routes/GameRoutes';
import userRoutes from './routes/UserRoutes';
// import setupSocket from './socket';
import swaggerDocs from './config/swagger';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from "socket.io"; 
import { startCronJobs } from './services/scheduler';

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

//ROUTES
app.use('/api/v1', gameRoutes);
app.use('/api/v1', userRoutes);


//SWAGGER

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

startCronJobs();

//SOCKET
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: "authorization, content-type",
    credentials: true
  }
});

// setupSocket(io);



server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

