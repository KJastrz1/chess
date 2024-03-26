import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ChessSquare, IGame, PossibleMove, SelectedPiece, White, initialBoard, } from '@/types';
import Loader from '@/components/Ui/Loader';
import { useGetGameById, useGetWebSocketToken } from '@/lib/queries';

import { calculatePossibleMoves, checkIfPossibleMove, checkCapture } from '@/logic/chessLogic';
import Square from '@/shared/Square';
import { useUserContext } from '@/context/AuthContext';
import { UseQueryResult } from 'react-query';


const SOCKET_SERVER_URL = "http://localhost:3000";
let socket: Socket;

function Board() {
  const { id: gameId } = useParams<{ id?: string }>();
  const { data: game, isLoading: isLoadingGame, error } = useGetGameById(gameId) as UseQueryResult<IGame, Error>;
  const { data: token, isLoading: isLoadingToken, error: errorToken } = useGetWebSocketToken();
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<PossibleMove[]>([]);
  const [gameState, setGameState] = useState<ChessSquare[][]>(initialBoard);
  const { user } = useUserContext();
  const isWhitePlayer = game?.whitePlayer === user._id;

  useEffect(() => {
    if (!socket && token) {
      socket = io(SOCKET_SERVER_URL, {
        auth: {
          token
        }
      });

      socket.on('connect', () => {
        console.log('Połączono z serwerem socket.io');
        socket.emit('joinGame', gameId, (message: string) => {
          console.log(message);
        });
      });

      socket.on("receiveMove", (move) => {
        console.log("Otrzymano ruch od serwera:", move);
      });
    }
    return () => {
      if (socket) {
        console.log('disconnecting socket.io');
        socket.disconnect();
      }
    };
  }, [token, gameId]);

  useEffect(() => {
    if (game && game.board) {
      setGameState(game.board);
      console.log('game:', game)
    }

  }, [game]);

  if (error || errorToken) return <div>Error loading the game.</div>;
  if (!socket || isLoadingGame || isLoadingToken) {
    return <Loader />
  }

  const handleClick = (figure: ChessSquare, row: number, col: number) => {
    const isFigureWhite = Object.values(White).includes(figure);
    let isOwnFigure = false;
    console.log('isFigureWhite', isFigureWhite);
    if ((isWhitePlayer && isFigureWhite) || (!isWhitePlayer && !isFigureWhite)) {
      isOwnFigure = true;
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
        destCol: col,
        figure: movedPiece
      }, gameId, (message: string) => {
        console.log(message);
      })

    } else if (isOwnFigure && figure !== "None") {
      setSelectedPiece({ figure, currentRow: row, currentCol: col });
      const moves = calculatePossibleMoves(figure, row, col, gameState);
      setPossibleMoves(moves);
    } else if (figure !== "None" || !isPossibleMove) {
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
