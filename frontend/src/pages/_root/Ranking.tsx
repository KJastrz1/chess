import React, { useState } from "react";
import { useGetGamesHistory } from "../../lib/queries";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";
import Select from "@/components/Ui/Select";
import { GameStatus, IGame, IGameHistoryParams } from "@/types";
import { useUserContext } from "@/context/AuthContext";

const Ranking = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();   
    const [tempParams, setTempParams] = useState<IGameHistoryParams>({ status: GameStatus.Finished });
    const [params, setParams] = useState<IGameHistoryParams>({ status: GameStatus.Finished });
    const gamesQuery = useGetGamesHistory(params);

    const handleSearchChange = (newParams: Partial<IGameHistoryParams>) => {
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

    const getOpponentUsername = (game: IGame) => {
        return game.player1 && game.player1._id !== user._id ? game.player1.username : game.player2 ? game.player2.username : 'Unknown';
    };

    const getGameResult = (game: IGame) => {
        if (game.winner === null) {
            return 'Draw';
        }
        if (game.winner === user._id) {
            return 'Won';
        }
        return 'Lost';
    }

    return (
        <div className="flex flex-col items-center p-4 gap-4">
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
                <div className="w-full md:p-10 ">
                    {gamesQuery.data.map((game: IGame) => (
                        <div key={game._id} className="grid grid-cols-3 items-center border-b border-gray-800 dark:border-gray-200 p-4">
                            <span className="justify-self-start">vs. {getOpponentUsername(game)}</span>
                            {getGameResult(game) === 'Won' ?
                                <span className="justify-self-center text-green-500">{getGameResult(game)}</span>
                                : getGameResult(game) === 'Lost' ?
                                    <span className="justify-self-center text-rose-500">{getGameResult(game)}</span>
                                    : <span className="justify-self-center text-white">{getGameResult(game)}</span>
                            }
                            <span className="justify-self-end">
                                <Button onClick={() => navigate(`/game/${game._id}`)}>
                                    Show Game
                                </Button>
                            </span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default Ranking;
