import { useEffect, useState } from "react";
import { useCreateGame, useGetGameById, useGetGames } from "../../lib/queries"
import { FaRegClock } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";
import LoadingButton from "@/components/Ui/LoadingButton";
import { GameStatus, IGameListItem, IGameParams, IGameParamsFrontend } from "@/types";
import PageButtons from "@/components/Ui/PageButtons";


const Play = () => {
    const [gameId, setGameId] = useState('');
    const [activeGameId, setActiveGameId] = useState('');
    const navigate = useNavigate();
    const { mutateAsync: createGame, isLoading: isLoadingCreateGame } = useCreateGame();
    const { data: game, isLoading: isLoadingGame } = useGetGameById(activeGameId);
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebounce(searchValue, 750);
    const [params, setParams] = useState<IGameParamsFrontend>({ status: GameStatus.WaitingForPlayer2, page: 1, itemsPerPage: 20, player1Username: debouncedSearch });
    const gamesQuery = useGetGames(params);

    const handleCreate = async () => {
        const data = await createGame();
        if (!data) {
            return;
        }
        navigate(`/game/${data._id}`);
    }

    const handleJoin = async () => {
        setActiveGameId(gameId);
        if (!game) {
            return;
        }
    }
    useEffect(() => {
        if (game) {
            navigate(`/game/${game._id}`);
        }
    }, [game])

    const handleSearchChange = (newParams: Partial<IGameParamsFrontend>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    const setPage = (page: number) => {
        handleSearchChange({ page });
    };

    return (
        <div className="flex flex-col w-full items-center p-4 gap-8">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">

                <Input type="text" placeholder="Search username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchValue(e.target.value) }} />


                <Button className="whitespace-nowrap" disabled={isLoadingCreateGame} onClick={handleCreate}>
                    {isLoadingCreateGame ? (
                        <div className="flex-center">
                            <LoadingButton />
                        </div>
                    ) : "Create game"}
                </Button>


                <div className="flex flex-row items-center gap-2 md:gap-4">
                    <Input className="w-56" type="text" placeholder="Enter game ID" onChange={(e) => { setGameId(e.target.value) }} />
                    <Button className="whitespace-nowrap" disabled={isLoadingGame} onClick={handleJoin}>
                        {isLoadingGame ? (
                            <div className="flex-center">
                                <LoadingButton />
                            </div>
                        ) : "Join game"}
                    </Button>
                </div>
            </div>

            {gamesQuery.isLoading &&
                <div className="flex w-full h-full p-10 justify-center items-center">
                    <Loader />
                </div>}

            {!gamesQuery.isLoading && gamesQuery.data &&
                < >
                    <div className="flex justify-center">
                        <PageButtons
                            page={gamesQuery.data.currentPage || 1}
                            totalPages={gamesQuery.data.totalPages || 1}
                            setPage={setPage} />
                    </div>
                    <div className="w-full md:w-[70%]">
                        <div className="grid grid-cols-3 text-lg font-semibold py-4 border-b border-gray-800 dark:border-gray-200">
                            <span className="justify-self-start ml-2">Player</span>
                            <span className="justify-self-center">Turn time</span>
                            <span className="justify-self-end mr-10">Action</span>
                        </div>
                        {gamesQuery.data.items.map((game: IGameListItem) => (
                            <div key={game._id} className="grid grid-cols-3 items-center border-b border-gray-800 dark:border-gray-200 p-4">
                                <span className="justify-self-start">{game.player1.username}</span>
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
                </>
            }
        </div >
    )
}

export default Play
