import { useGetWebSocketToken } from "@/lib/queries";
import { createContext, useContext, useEffect, ReactNode } from "react";
import io, { Socket } from "socket.io-client";


const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}
const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: token, isLoading: isLoadingToken, error: errorToken } = useGetWebSocketToken();

  let socket: Socket;

  useEffect(() => {
    if (!socket && token) {
      console.log('Tworzenie socket.io');
      socket = io(SOCKET_SERVER_URL, {
        auth: {
          token
        }
      });
    }


  }, [token]);

  useEffect(() => {
    return () => {
      if (socket) {
        console.log('disconnecting socket.io');
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
