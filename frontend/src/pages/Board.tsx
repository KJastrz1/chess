import { useState } from 'react';
import Field from "../components/Field";
import { ChessSquare } from "../enums/chessPieces";
import { initialBoard, calculatePossibleMoves, checkIfPossibleMove, checkCapture } from '../logic/chessLogic';
import { PossibleMove, SelectedPiece } from '../types/types';

function Board() {
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<PossibleMove[]>([]);
  const [gameState, setGameState] = useState<ChessSquare[][]>(initialBoard);

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
          <Field
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
