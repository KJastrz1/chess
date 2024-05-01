import { useState } from "react";
import { useGetGames, useGetGamesHistory } from "../../lib/queries"
import { FaRegClock } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";

import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";
import LoadingButton from "@/components/Ui/LoadingButton";
import { GameStatus, IGame, IGameHistoryParams, IGameListItem, IGameParams } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import Select from "@/components/Ui/Select";


const GameHistory = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [gameResult, setGameResult] = useState<string>("");
    const [tempParams, setTempParams] = useState<IGameHistoryParams>({ status: GameStatus.Finished });
    const [params, setParams] = useState<IGameHistoryParams>({ status: GameStatus.Finished });
    const gamesQuery = useGetGamesHistory(params);


    const handleSearchChange = (newParams: Partial<IGameHistoryParams>) => {
        setTempParams(prev => ({ ...prev, ...newParams }));
    };

    const handleSearch = () => {
        setParams(tempParams);
    };

    const handleResultChange = (event) => {
        setGameResult(event.target.value);
        switch (gameResult) {
            case "won":
                handleSearchChange({ result: 'won' });
                break;
            case "lost":
                handleSearchChange({ result: 'lost' });
                break;
            case "draw":
                handleSearchChange({ result: 'draw' });
                break;
            default:
        }
    };

    return (
        <div className="flex flex-col items-center p-4 gap-3">
            <Input
                placeholder="Search by opponent username"
                onChange={(e) => handleSearchChange({ opponentUsername: e.target.value })}
            />
            <Select id="gameResult" value={gameResult} onChange={handleResultChange}>
                <option value="">Select result</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="draw">Draw</option>
            </Select>
            <Button onClick={handleSearch}>Szukaj</Button>
            <div>
                {gamesQuery.isLoading ? (
                    <Loader />
                ) : gamesQuery.error ? (
                    <div>Error: {gamesQuery.error.message}</div>
                ) : (
                    <ul>
                        {gamesQuery.data?.map((game: IGame) => (
                            (<li key={game._id}>
                                {user.username} vs {game.player1.username} - Result: {game.winner}
                            </li>)
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default GameHistory;
