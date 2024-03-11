import { useEffect, useState } from 'react';
import Square from "../../shared/Square";
import { ChessSquare } from "../../enums/chessPieces";
import { initialBoard, calculatePossibleMoves, checkIfPossibleMove, checkCapture } from '../../logic/chessLogic';
import { PossibleMove, SelectedPiece } from '../../types/types';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:3000";

export const socket = io(SOCKET_SERVER_URL);

function Board() {
  const { id: gameId } = useParams();
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<PossibleMove[]>([]);
  const [gameState, setGameState] = useState<ChessSquare[][]>(initialBoard);

  useEffect(() => {
    if (!socket) return;

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

  if (!socket) {
    return <p>Loading...</p>
  }

  const handleClick = (figure: ChessSquare, row: number, col: number) => {
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

    } else if (figure !== "None") {
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
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="grid grid-cols-8 gap-0 ">
        {renderBoard()}
      </div>
    </div>
  );
}

export default Board;
