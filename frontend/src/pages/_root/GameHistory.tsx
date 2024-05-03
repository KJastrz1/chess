import React, { useState } from "react";
import { useGetGamesHistory } from "../../lib/queries";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";
import Select from "@/components/Ui/Select";
import { GameStatus, IGameResponse, IGameHistoryParamsFrontend } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import PageButtons from "@/components/Ui/PageButtons";

const GameHistory = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [gameResult, setGameResult] = useState("");
    const [tempParams, setTempParams] = useState<IGameHistoryParamsFrontend>({ status: GameStatus.Finished, page: 1, itemsPerPage: 20 });
    const [params, setParams] = useState<IGameHistoryParamsFrontend>({ status: GameStatus.Finished, page: 1, itemsPerPage: 20 });
    const gamesQuery = useGetGamesHistory(params);

    const handleSearchChange = (newParams: Partial<IGameHistoryParamsFrontend>) => {
        setTempParams(prev => ({ ...prev, ...newParams }));
    };

    const handleSearch = () => {
        setParams(tempParams);
    };

    const handleResultChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newResult = event.target.value;
        setGameResult(newResult);
        handleSearchChange({ result: newResult });
    };

    const setPage = (page: number) => {
        handleSearchChange({ page });
    };

    const getOpponentUsername = (game: IGameResponse) => {
        return game.player1 && game.player1._id !== user._id ? game.player1.username : game.player2 ? game.player2.username : 'Unknown';
    };

    const getGameResult = (game: IGameResponse) => {
        if (game.winner === null) {
            return 'Draw';
        }
        if (game.winner === user._id) {
            return 'Won';
        }
        return 'Lost';
    }

    return (
        <div className="flex flex-col w-full items-center p-4 gap-8">
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Opponent username"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange({ opponentUsername: e.target.value })}
                />
                <Select id="gameResult" value={gameResult} onChange={handleResultChange}>
                    <option value="">Any result</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                    <option value="draw">Draw</option>
                </Select>
                <Button onClick={handleSearch}>Search</Button>
            </div>

            {gamesQuery.isLoading ? (
                <div className="flex w-full h-full p-10 justify-center items-center">
                    <Loader />
                </div>
            ) : gamesQuery.data ? (
                < >
                    <div className="flex justify-center">
                        <PageButtons
                            page={gamesQuery.data.currentPage || 1}
                            totalPages={gamesQuery.data.totalPages || 1}
                            setPage={setPage} />
                    </div>
                    {gamesQuery.data.items.map((game: IGameResponse) => (
                        <div key={game._id} className="md:w-[70%] grid grid-cols-3 items-center border-b border-gray-800 dark:border-gray-200 p-4">
                            <span className="justify-self-start">vs. {getOpponentUsername(game)}</span>
                            {getGameResult(game) === 'Won' ?
                                <span className="justify-self-center text-green-500">{getGameResult(game)}</span>
                                : getGameResult(game) === 'Lost' ?
                                    <span className="justify-self-center text-rose-500">{getGameResult(game)}</span>
                                    : <span className="justify-self-center text-white">{getGameResult(game)}</span>
                            }
                            <span className="justify-self-end">
                                <Button onClick={() => navigate(`/history/${game._id}`)}>
                                    Show Game
                                </Button>
                            </span>
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    );
};

export default GameHistory;
