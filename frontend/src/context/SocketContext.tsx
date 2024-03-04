import { createContext, useContext, useEffect, ReactNode } from "react";
import io, { Socket } from "socket.io-client";


const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {

  const socket: Socket = io("http://localhost:3000");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    socket.on("error", (error) => {
      console.log(error);
    });


    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
