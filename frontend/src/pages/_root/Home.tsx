import { useState } from "react";
import { useCreateGame, useGetGameById, useSearchGames } from "../../lib/queries"
import { FaRegClock } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";

import useDebounce from "@/hooks/useDebounce";
import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";

import LoadingButton from "@/components/Ui/LoadingButton";
import { ref } from "yup";
import { IGameListItem } from "@chess/types";



const Home = () => {
    
    const [gameId, setGameId] = useState('');    
    const navigate = useNavigate();
    const { mutateAsync: createGame, isLoading: isLoadingCreateGame, data } = useCreateGame();
    const { data: game, isLoading: isLoadingGame, error, refetch  } = useGetGameById(gameId);
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebounce(searchValue, 750);
    const { data: games, isLoading: isLoadingGames, error: errorGames } = useSearchGames(debouncedSearch);

    const handleCreate = async () => {
        const data = await createGame();
        console.log(data);
        if (!data) {
            return;
        }
        navigate(`/game/${data._id}`);
    }

    const handleJoin = async () => {
        await refetch();
        if (!game) {
            return;
        }
        navigate(`/game/${game._id}`);
    }


    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex flex-col md:flex-row gap-3 w-full justify-between items-center lg:px-10">

                <Input type="text" placeholder="Search username" onChange={(e) => { setSearchValue(e.target.value) }} />


                <Button className="whitespace-nowrap" disabled={isLoadingCreateGame} onClick={handleCreate}>
                    {isLoadingCreateGame ? (
                        <div className="flex-center">
                            <LoadingButton />
                        </div>
                    ) : "Create game"}
                </Button>


                <div className="flex flex-row items-center gap-4">
                    <Input type="text" placeholder="Enter game ID" onChange={(e) => { setGameId(e.target.value) }} />
                    <Button className="whitespace-nowrap ml-4" disabled={isLoadingGame} onClick={handleJoin}>
                        {isLoadingGame ? (
                            <div className="flex-center">
                                <LoadingButton />
                            </div>
                        ) : "Join game"}
                    </Button>
                </div>
            </div>

            {isLoadingGames &&
                <div className="flex w-full h-full p-10 justify-center items-center">
                    <Loader />
                </div>}


            {!isLoadingGames && games &&
                <div className="w-full md:p-10">
                    <div className="grid grid-cols-3 text-lg font-semibold py-4 border-b border-gray-800 dark:border-gray-200">
                        <span className="justify-self-start ml-2">Player</span>
                        <span className="justify-self-center">Turn time</span>
                        <span className="justify-self-end mr-10">Action</span>
                    </div>
                    {games.map((game: IGameListItem) => (
                        <div key={game._id} className="grid grid-cols-3 items-center border-b border-gray-800 dark:border-gray-200 p-4">
                            <span className="justify-self-start">{game.player1?.username}</span>
                            <span className="justify-self-center">
                                <FaRegClock className="text-lg mr-1 inline" />
                                {game.moveTime} s
                            </span>
                            <span className="justify-self-end">
                                <Button onClick={() => navigate(`/game/${game._id}`)} >
                                    Join Game
                                </Button>
                            </span>
                        </div>
                    ))}
                </div>
            }
        </div >
    )
}

export default Home
