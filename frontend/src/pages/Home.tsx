import { useContext, useEffect, useState } from "react";
import { useCreateGame, useGetGameById } from "../lib/queries"
import Input from "../components/Ui/Input";
import { useNavigate } from "react-router-dom";


const Home = () => {

    const [gameId, setGameId] = useState('');
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([] as string[]);
    const navigate = useNavigate();    
    const { mutateAsync: createGame, isLoading: isLoadingCreateGame, data } = useCreateGame();
    const { data: game, isLoading: isLoadingGame, error } = useGetGameById(gameId);



    const handleCreate = async () => {
        const data = await createGame();
        if (!data) return
        navigate(`/game/${data._id}`);
       

    }

    const handleJoin = async () => {
        navigate(`/game/${game._id}`);

    }


    return (
        <div className="flex flex-col gap-10 justify-center items-center h-screen w-screen">
            <button disabled={isLoadingCreateGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreate}>
                Create new game
            </button>
            {isLoadingCreateGame && <p>Loading...</p>}
            {data && <p>Game ID: {data._id}</p>}


            <Input type="text" placeholder="Enter game ID" onChange={(e) => { setGameId(e.target.value) }} />

            <button disabled={!isLoadingGame} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleJoin}>
                Join game
            </button>
            {isLoadingGame && <p>Loading...</p>}
            {error && <p>Game not found</p>}
            {/* <Input type="text" placeholder="enter message" onChange={(e) => { setMessage(e.target.value) }} />

            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSend}>
                send
            </button>

            {allMessages.map((message, index) => (
                <p key={index}>{message}</p>
            ))} */}
        </div>
    )
}

export default Home
