import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ChessSquare, IGame, IMove, PossibleMove, SelectedPiece, White, initialBoard, } from '@/types';
import Loader from '@/components/Ui/Loader';
import { useGetWebSocketToken } from '@/lib/queries';
import { calculatePossibleMoves, checkIfPossibleMove, checkCapture } from '@/logic/chessLogic';
import Square from '@/shared/Square';
import { useUserContext } from '@/context/AuthContext';
import { set } from 'zod';

const SOCKET_SERVER_URL = "http://localhost:3000";
let socket: Socket;

function Board() {
  const { id: gameId } = useParams<{ id: string }>();
  const { data: token, isLoading: isLoadingToken, error: errorToken } = useGetWebSocketToken();
  const [isLoadingGameFromSocket, setIsLoadingGameFromSocket] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<PossibleMove[]>([]);
  const [gameState, setGameState] = useState<ChessSquare[][]>(initialBoard);
  const { user } = useUserContext();
  const [isWhitePlayer, setIsWhitePlayer] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [moves, setMoves] = useState<IMove[]>([]);
  const [game, setGame] = useState<IGame | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);

  const executeMove = (move: IMove) => {
    // console.log("Wykonano ruch:", move);
    const newGameState = gameState.map(row => [...row]);
    const movedPiece = newGameState[move.srcRow][move.srcCol];
    newGameState[move.destRow][move.destCol] = movedPiece;
    newGameState[move.srcRow][move.srcCol] = "None";
    setGameState(newGameState);
    setMoves((prevMoves) => [...prevMoves, move]);
  };

  useEffect(() => {   
    if (!socket && token) {
      console.log('Tworzenie socket.io');
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
      socket.on('receiveGame', (receivedGame: IGame) => {
        // console.log('Otrzymano aktualizację gry:', receivedGame);
        setGame(receivedGame);
        setGameState(receivedGame.board);
        setIsPlayerTurn(receivedGame.whosMove === user._id);
        setIsWhitePlayer(receivedGame.whitePlayer === user._id);
        setMoves(receivedGame.moves);
        setIsLoadingGameFromSocket(false);
      });

      socket.on("receiveMove", (move: IMove, gameState: ChessSquare[][]) => {
        console.log("Otrzymano ruch od serwera:", move);
        // executeMove(move);
        setIsPlayerTurn(true);
        setGameState(gameState);
        setMoves((prevMoves) => [...prevMoves, move]);

      });
      socket.on('playerLeft', () => {
        console.log('player left')
        setOpponentLeft(true);
      })
    }
  }, [token]);

  // useEffect(() => {
  //   console.log("gameState changed:", gameState);
  // }, [gameState]);

  useEffect(() => {
    return () => {
      if (socket) {
        console.log('disconnecting socket.io');
        socket.disconnect();
      }
    };
  }, []);

  if (errorToken) return <div>Error loading the game.</div>;
  if (!socket || isLoadingGameFromSocket || isLoadingToken) {
    return <Loader />;
  }



  const handleClick = (figure: ChessSquare, row: number, col: number) => {
    console.log('Clicked:', figure, row, col);
    if (!isPlayerTurn) {
      console.log('Not your turn');
      return;
    }

    const isFigureWhite = Object.values(White).includes(figure);
    let isOwnFigure = false;

    if ((isWhitePlayer && isFigureWhite) || (!isWhitePlayer && !isFigureWhite)) {
      isOwnFigure = true;
    }

    const isPossibleMove = checkIfPossibleMove(possibleMoves, row, col);

    if (isPossibleMove && selectedPiece) {
      const move: IMove = { srcRow: selectedPiece.currentRow, srcCol: selectedPiece.currentCol, destRow: row, destCol: col, figure: selectedPiece.figure };
      executeMove(move);
      setPossibleMoves([]);
      setSelectedPiece(null);
      setIsPlayerTurn(false);
      socket.emit('sendMove', move, gameId, (message: string) => {
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
    <div className="flex flex-col md:flex-row justify-start items-center gap-5 h-full w-full py-2 px-2 md:px-4">
      <div className="grid grid-cols-8 gap-0 ">
        {renderBoard()}
      </div>

      {opponentLeft && (
        <div className="flex flex-col justify-center self-start p-5">
          <div className="text-xl font-semibold text-red">Opponent has left the game!</div>
          <div className="text-md text-orange-400">Game was saved. You can safely leave.</div>
        </div>
      )}
      {game?.status === 'waiting' && <div className="flex flex-col justify-center self-start p-5">
        <div className="text-xl font-semibold">Waiting for the opponent to join...</div>
      </div>}
      {game?.status !== 'waiting' && <div className="flex flex-col justify-center self-start md:p-5">
        {isWhitePlayer && <div className="text-xl font-semibold">You are white</div>}
        {!isWhitePlayer && <div className="text-xl font-semibold">You are black</div>}
        {isPlayerTurn && <div className="text-xl font-semibold">Your turn</div>}
        {!isPlayerTurn && <div className="text-xl font-semibold">Opponent's turn</div>}
        <div className="text-xl font-semibold">Moves:</div>
        <div className="flex flex-col gap-2">
          {moves.map((move, index) => (
            <div key={index} className="text-lg">{`${move.srcRow},${move.srcCol} -> ${move.destRow},${move.destCol}`}</div>
          ))}
        </div>
      </div>}
    </div>
  );
}

export default Board;
