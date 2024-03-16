import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import Square from "../../shared/Square";
import { initialBoard, calculatePossibleMoves, checkIfPossibleMove, checkCapture } from '@/logic/chessLogic';
import { PossibleMove, SelectedPiece } from '@/types/types';
import { useGetGameById } from '@/lib/queries';
import Loader from '@/components/Ui/Loader';
import { useUserContext } from '@/context/AuthContext';
import { ChessSquare, White } from '@/enums/chessPieces';

const SOCKET_SERVER_URL = "http://localhost:3000";

export const socket = io(SOCKET_SERVER_URL);

function Board() {
  const { id: gameId } = useParams<{ id?: string }>();

  const { data: game, isLoading: isLoadingGame, error, refetch } = useGetGameById(gameId);
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<PossibleMove[]>([]);
  const [gameState, setGameState] = useState<ChessSquare[][]>(initialBoard);
  const { user } = useUserContext();
  const isWhitePlayer = true;

  useEffect(() => {
    if (!socket) return;
    refetch();

    socket.emit('joinGame', gameId, (message: string) => {
      console.log(message);
    });
    socket.on("receiveMove", (move) => {
      console.log("Otrzymano ruch od serwera:", move);
    });
    return () => {
      socket.off("receiveMove");
    };

  }, []);

  useEffect(() => {
    if (game && game.board) {
      setGameState(game.board);
    }
  }, [game]);

  if (error) return <div>Error loading the game.</div>;
  if (!socket || isLoadingGame) {
    return <Loader />
  }

  const handleClick = (figure: ChessSquare, row: number, col: number) => {
    const isFigureWhite = Object.values(White).includes(figure);
    if ((isWhitePlayer && !isFigureWhite) || (!isWhitePlayer && isFigureWhite)) {
      return;
    }
    const isPossibleMove = checkIfPossibleMove(possibleMoves, row, col);

    if (isPossibleMove && selectedPiece) {
      const newGameState = [...gameState];
      const movedPiece = newGameState[selectedPiece.currentRow][selectedPiece.currentCol];
      newGameState[row][col] = movedPiece;
      newGameState[selectedPiece.currentRow][selectedPiece.currentCol] = "None";
      setGameState(newGameState);
      setPossibleMoves([]);
      setSelectedPiece(null);
      socket.emit('sendMove', {
        srcRow: selectedPiece.currentRow,
        srcCol: selectedPiece.currentCol,
        destRow: row,
        destCol: col
      }, gameId);

    } else if (figure !== "None" && isWhitePlayer && Object.values(ChessSquare).includes(figure)) {
      setSelectedPiece({ figure, currentRow: row, currentCol: col });
      const moves = calculatePossibleMoves(figure, row, col, gameState);
      setPossibleMoves(moves);
    } else if (figure === "None" && !isPossibleMove) {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  }


  const renderBoard = () => {
    return gameState.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        const isWhite = (rowIndex + colIndex) % 2 === 0;
        const figure = cell;
        const highlight = checkIfPossibleMove(possibleMoves, rowIndex, colIndex);
        const capture = highlight && checkCapture(selectedPiece, rowIndex, colIndex, gameState);

        return (
          <Square
            key={`${rowIndex}-${colIndex}`}
            onClick={handleClick}
            isWhite={isWhite}
            figure={figure}
            highlight={highlight}
            row={rowIndex}
            col={colIndex}
            capture={capture}

          />
        );
      });
    });
  };

  return (
    <div className="flex justify-center items-center h-full w-full py-2 md:px-4">
      <div className="grid grid-cols-8 gap-0 ">
        {renderBoard()}
      </div>
    </div>
  );
}

export default Board;
