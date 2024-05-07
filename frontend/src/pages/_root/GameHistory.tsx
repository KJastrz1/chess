import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '@/components/Ui/Loader';
import Square from '@/shared/Square';
import { ChessSquare, IGameResponse, IUserProfileResponse, initialBoard } from '@/types';
import { useGetGameById } from '@/lib/queries';
import Button from '@/components/Ui/Button';
import { useUserContext } from '@/context/AuthContext';
import Input from '@/components/Ui/Input';

const GameHistory = () => {
  const { user } = useUserContext();
  const { id: gameId } = useParams<{ id: string }>();
  const gameQuery = useGetGameById(gameId as string, true);
  const [game, setGame] = useState<IGameResponse | null>(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [currentBoard, setCurrentBoard] = useState<ChessSquare[][]>([]);



  useEffect(() => {
    if (gameQuery.data) {
      setGame(gameQuery.data);
      setCurrentBoard(gameQuery.data.board);
      console.log("moves len", gameQuery.data.moves.length)
    }
  }, [gameQuery.data]);

  useEffect(() => {
    if (game) {
      const newBoard = JSON.parse(JSON.stringify(initialBoard));
      game.moves.slice(0, currentMove).forEach(move => {
        console.log("move", move)
        newBoard[move.destRow][move.destCol] = newBoard[move.srcRow][move.srcCol];
        newBoard[move.srcRow][move.srcCol] = 'None';
      });
      setCurrentBoard(newBoard);
      console.log(currentBoard)
    }
  }, [currentMove, game]);

  if (!game) {
    return <Loader />;
  }

  const handlePrevMove = () => {
    setCurrentMove(current => Math.max(0, current - 1));
  };

  const handleNextMove = () => {
    setCurrentMove(current => Math.min(game.moves.length, current + 1));
  };

  const renderBoard = (): JSX.Element[][] => {
    return currentBoard.map((row, rowIndex) =>
      row.map((figure, colIndex) => (
        <Square
          key={`${rowIndex}-${colIndex}`}
          isWhite={(rowIndex + colIndex) % 2 === 0}
          figure={figure}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-start items-center gap-4 h-full w-full py-2 px-2 md:px-4">
      <div className="grid grid-cols-8 gap-0">
        {renderBoard()}
      </div>
      <div className='flex flex-col justify-center items-center gap-3'>
        <p>
          Game against{' '}
          <span className="font-semibold">
            {game.player1._id === user._id ? (game.player2 as IUserProfileResponse).username : game.player1.username}
          </span>
        </p>
        <p>
          You were playing {game.whitePlayer === user._id ? 'white' : 'black'}
        </p>
        <Input
          type="range"
          min="0"
          max={game.moves.length}
          value={currentMove}
          onChange={(e) => setCurrentMove(Number(e.target.value))}
          className="w-full m-0"
        />
        <div className='flex flex-row gap-3 items-center'>
          <Button onClick={handlePrevMove} disabled={currentMove === 0}>Previous</Button>
          {currentMove} / {game.moves.length}
          <Button onClick={handleNextMove} disabled={currentMove === game.moves.length}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
