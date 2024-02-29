import { useEffect, useRef, useState } from "react";
import { useCreateGame, } from "../lib/queries"
import { createSocket } from "../lib/socket";
import Input from "../components/Ui/Input";
import { Socket } from "socket.current.io-client";



const Home = () => {
    const { mutate: createGame, isLoading: isLoadingCreateGame, data } = useCreateGame();
    const [gameId, setGameId] = useState('');
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([] as string[]);

    const socket = useRef<Socket | null>(null);


    useEffect(() => {
        if (!socket.current) {
            socket.current = createSocket();
        }
        socket.current.on("receiveMessage", (receivedMessage: string) => {
            setAllMessages(prevMessages => [...prevMessages, receivedMessage]);
        });
        return () => {
            socket.current.emit('leaveGame', gameId);
            socket.current.disconnect();
            
        };
    }, []);


    useEffect(() => {
        if (!data) return
        socket.current.emit('joinGame', data._id, (message: string) => {
            console.log(message);
        });

    }, [data])

    const handleCreate = async () => {
        createGame();

    }

    const handleJoin = () => {
        socket.current.emit('joinGame', gameId, (message: string) => {
            console.log(message);
        });
    }

    const handleSend = () => {
        socket.current.emit('sendMessage', { message, gameId });
        setAllMessages([...allMessages, message]);
        setMessage('');
    }

    return (
        <div className="flex flex-col gap-10 justify-center items-center h-screen w-screen">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreate}>
                Create new game
            </button>
            {isLoadingCreateGame && <p>Loading...</p>}
            {data && <p>Game ID: {data._id}</p>}


            <input type="text" placeholder="Enter game ID" onChange={(e) => { setGameId(e.target.value) }} />

            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleJoin}>
                Join game
            </button>

            <input type="text" placeholder="enter message" onChange={(e) => { setMessage(e.target.value) }} />

            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSend}>
                send
            </button>

            {allMessages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
    )
}

export default Home
