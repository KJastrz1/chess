import { useState } from "react";
import { useGetGames } from "../../lib/queries"
import { FaRegClock } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";

import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";
import LoadingButton from "@/components/Ui/LoadingButton";
import { GameStatus, IGame, IGameListItem, IGameParams } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import Select from "@/components/Ui/Select";


const GameHistory = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [gameResult, setGameResult] = useState<string>("");
    const [tempParams, setTempParams] = useState<IGameParams>({});
    const [params, setParams] = useState<IGameParams>({ status: GameStatus.Finished });
    const gamesQuery = useGetGames(params);


    const handleSearchChange = (newParams: Partial<IGameParams>) => {
        setTempParams(prev => ({ ...prev, ...newParams }));
    };

    const handleSearch = () => {
        setParams(tempParams);
    };

    const handleResultChange = (event) => {
        setGameResult(event.target.value);
        switch (gameResult) {
            case "won":
                handleSearchChange({ winner: user._id });
                break;
            case "lost":
                handleSearchChange({ winner: { $ne: user._id, $ne: null } });
                break;
            case "draw":
                handleSearchChange({ winner: 'draw' });
                break;
            default:
            // Handle unexpected case
        }
    };

    return (
        <div className="flex flex-col items-center p-4 gap-3">
            <Input
                placeholder="Search by opponent username"
                onChange={(e) => handleSearchChange({ player2Username: e.target.value })}
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
