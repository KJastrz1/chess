import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";
export const socket = io(SOCKET_SERVER_URL);

socket.on('connect', () => {
    console.log('Połączono z serwerem Socket.IO:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Rozłączono z serwerem Socket.IO:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Błąd połączenia z serwerem Socket.IO:', error);
});