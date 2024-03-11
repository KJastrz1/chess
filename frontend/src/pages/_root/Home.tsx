import { useState } from "react";
import { useCreateGame, useGetGameById, useSearchGames } from "../../lib/queries"

import { useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";



const Home = () => {

    const [gameId, setGameId] = useState('');
    const navigate = useNavigate();
    const { mutateAsync: createGame, isLoading: isLoadingCreateGame, data } = useCreateGame();
    const { data: game, isLoading: isLoadingGame, error } = useGetGameById(gameId);

    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebounce(searchValue, 750);
    const { data: games, isLoading: isLoadingGames, error: errorGames } = useSearchGames(debouncedSearch);

    const handleCreate = async () => {
        const data = await createGame();
        if (!data) {
            return;
        }
        navigate(`/game/${data._id}`);

    }

    const handleJoin = async () => {
        navigate(`/game/${game._id}`);

    }

 

    return (
        <div className="flex flex-col items-center w-full p-10">
            <div className="flex flex-col md:flex-row gap-3 justify-center items-center">

                <Input type="text" className="h-3/5" placeholder="Search username" onChange={(e) => { setSearchValue(e.target.value) }} />

                <Button className="mx-8 whitespace-nowrap" disabled={isLoadingCreateGame} onClick={handleCreate}>
                    {isLoadingCreateGame ? (
                        <div className="flex-center">
                            <Loader />
                        </div>
                    ) : "Create game"}
                </Button>

                <Input type="text" className="h-3/5" placeholder="Enter game ID" onChange={(e) => { setGameId(e.target.value) }} />

                <Button className="whitespace-nowrap" disabled={isLoadingGame} onClick={handleJoin}>
                    {isLoadingGame ? (
                        <div className="flex-center">
                            <Loader />
                        </div>
                    ) : "Join game"}
                </Button>

            </div>

            <div className="flex items-center h-full">
                {isLoadingGames && <Loader />}
            </div>

            <div className="flex flex-col items-center w-full p-10">
                {!isLoadingGames && games && games.map((game) => {
                    return (
                        <div key={game._id}>
                            <p>{game._id}</p>
                        </div>
                    )
                })
                }
            </div>
        </div >
    )
}

export default Home
