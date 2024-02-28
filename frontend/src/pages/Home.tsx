import { useEffect } from "react";
import { useCreateGame, useGetGameById } from "../lib/queries"
import { io } from "socket.io-client";


const SOCKET_SERVER_URL = "http://localhost:3000";

const Home = () => {
    const { mutate: createGame, isLoading, error } = useCreateGame();


    useEffect(() => {
        // Nawiązywanie połączenia z serwerem Socket.IO
        const socket = io(SOCKET_SERVER_URL);

        // Dołączanie do gry
        const gameId = "yourGameId"; // Powinieneś to uzyskać w odpowiedni sposób
        socket.emit('joinGame', gameId);

        // Nasłuchiwanie na ruchy w grze


        // Opuść grę przy odmontowywaniu komponentu
        return () => {
            socket.emit('leaveGame');
            socket.off(); // Usuwa wszystkich nasłuchujących
        };
    }, []);

    const handleClick = () => {
        createGame();
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
                Create new game
            </button>
            {isLoading && <p>Loading...</p>}

        </div>
    )
}

export default Home
