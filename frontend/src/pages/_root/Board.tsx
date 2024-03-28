import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ChessSquare, IGame, IMove, PossibleMove, SelectedPiece, White, initialBoard, } from '@/types';
import Loader from '@/components/Ui/Loader';
import { useGetWebSocketToken } from '@/lib/queries';
import { calculatePossibleMoves, checkIfPossibleMove, checkCapture } from '@/logic/chessLogic';
import Square from '@/shared/Square';
import { useUserContext } from '@/context/AuthContext';

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

  const executeMove = (move: IMove) => {
    console.log("Wykonano ruch:", move);
    const newGameState = [...gameState];
    const movedPiece = newGameState[move.srcRow][move.srcCol];
    newGameState[move.destRow][move.destCol] = movedPiece;
    newGameState[move.srcRow][move.srcCol] = "None";
    setGameState(newGameState);
    setMoves((prevMoves) => [...prevMoves, move]);
  };

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
      socket.on('receiveGame', (receivedGame: IGame) => {
        console.log('Otrzymano aktualizację gry:', receivedGame);
        setGame(receivedGame);
        setGameState(receivedGame.board);
        setIsPlayerTurn(receivedGame.whosMove === user._id);
        setIsWhitePlayer(receivedGame.whitePlayer === user._id);
        setMoves(receivedGame.moves);
        setIsLoadingGameFromSocket(false);
      });

      socket.on("receiveMove", (move: IMove) => {
        console.log("Otrzymano ruch od serwera:", move);
        executeMove(move);
        setIsPlayerTurn(true);

      });
      socket.on('playerLeft', () => {
        console.log('player left')
        socket.disconnect();
      })
    }
  }, [token, gameId]);


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
      const move = { srcRow: selectedPiece.currentRow, srcCol: selectedPiece.currentCol, destRow: row, destCol: col, figure: figure };
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
    <div className="flex justify-start items-center gap-5 h-full w-full py-2 md:px-4">
      <div className="grid grid-cols-8 gap-0 ">
        {renderBoard()}
      </div>
      {game?.status === 'waiting' && <div className="flex flex-col justify-center self-start p-5">
        <div className="text-xl font-semibold">Waiting for the opponent to join...</div>
      </div>}
      {game?.status !== 'waiting' && <div className="flex flex-col justify-center self-start p-5">
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
