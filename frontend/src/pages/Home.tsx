import { useEffect, useState } from "react";
import { useCreateGame, } from "../lib/queries"
import { socket } from "../lib/socket";
import Input from "../components/Ui/Input";


const Home = () => {
    const { mutate: createGame, isLoading: isLoadingCreateGame, data } = useCreateGame();
    const [gameId, setGameId] = useState('');
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([] as string[]);


    useEffect(() => {
        socket.on("receiveMessage", (receivedMessage) => {
            setAllMessages(prevMessages => [...prevMessages, receivedMessage]);
        });
        return () => {
            socket.emit('leaveGame', gameId);
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        if(!data) return
        socket.emit('joinGame', data._id, (message: string) => {
            console.log(message);
        });

    },[data])    

    const handleCreate = async () => {
        createGame();

    }

    const handleJoin = () => {
        socket.emit('joinGame', gameId, (message: string) => {
            console.log(message);
        });
    }

    const handleSend = () => {
        socket.emit('sendMessage', { message, gameId });
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


            <Input type="text" placeholder="Enter game ID" onChange={(e) => { setGameId(e.target.value) }} />

            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleJoin}>
                Join game
            </button>

            <Input type="text" placeholder="enter message" onChange={(e) => { setMessage(e.target.value) }} />

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
