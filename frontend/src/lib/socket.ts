import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";

export const createSocket = () => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
        console.log('Connected to Socket.IO server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('Disconnected from Socket.IO server:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error with Socket.IO server:', error);
    });

    return socket;
};
