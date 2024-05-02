import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ChessSquare, GameStatus, IGameResponse, IMove, PossibleMove, SelectedPiece, White } from '@/types';
import Loader from '@/components/Ui/Loader';
import { useGetWebSocketToken } from '@/lib/queries';
import { calculatePossibleMoves, checkIfPossibleMove, checkCapture } from '@/logic/chessLogic';
import Square from '@/shared/Square';
import { useUserContext } from '@/context/AuthContext';
import Button from '@/components/Ui/Button';
import Input from '@/components/Ui/Input';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL;
let socket: Socket;

function Board() {
  const { id: gameId } = useParams<{ id: string }>();
  const { data: token, isLoading: isLoadingToken, error: errorToken } = useGetWebSocketToken();
  const [isLoadingGameFromSocket, setIsLoadingGameFromSocket] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<PossibleMove[]>([]);
  const { user } = useUserContext();
  const [isWhitePlayer, setIsWhitePlayer] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [game, setGame] = useState<IGameResponse | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [moveTimer, setMoveTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [moveTimeInput, setMoveTimeInput] = useState<number>(180);
  const [moveTimeMessage, setMoveTimeMessage] = useState<string | null>(null);

  const startTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
    if (moveTimer) {
      clearTimeout(moveTimer);
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime && prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime ? prevTime - 1 : 0;
      });
    }, 1000);
    setMoveTimer(timerId);
  }, [setTimeLeft, moveTimer]);

  useEffect(() => {
    if (!socket && token) {
      socket = io(SOCKET_SERVER_URL, { auth: { token } });

      socket.on('connect', () => {
        socket.emit('joinGame', gameId, (message: string) => {
          console.log(message);
        });
      });

      socket.on('receiveGame', (receivedGame: IGameResponse) => {
        console.log("receivedGame", receivedGame)
        setGame(receivedGame);
        setMoveTimeMessage('Time limit set to: ' + receivedGame.moveTime + ' seconds');
        setMoveTimeInput(receivedGame.moveTime);
        setIsPlayerTurn(receivedGame.whosMove === user._id);
        setIsWhitePlayer(receivedGame.whitePlayer === user._id);
        setIsLoadingGameFromSocket(false);
        setOpponentLeft(false);
      });

      socket.on('timeOut', (newTurnObject: { newTurn: string }) => {
        setIsPlayerTurn(newTurnObject.newTurn === user._id);
        // console.log('timeOut');
      });

      socket.on('playerLeft', () => {
        setOpponentLeft(true);
      });
    }
    return () => {
      socket?.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (game && game.status === GameStatus.InProgress) {
      startTimer(game.moveTime);
      // console.log('starting timer again for game', game._id);
    }
  }, [game, isPlayerTurn]);

  useEffect(() => {
    return () => {
      if (moveTimer) {
        clearTimeout(moveTimer);
      }
    };
  }, [moveTimer]);

  const executeMove = (move: IMove): void => {
    setGame((currentGame) => {
      if (!currentGame) return null;
      const newBoard = currentGame.board.map(row => [...row]);
      newBoard[move.destRow][move.destCol] = newBoard[move.srcRow][move.srcCol];
      newBoard[move.srcRow][move.srcCol] = "None";
      return {
        ...currentGame,
        board: newBoard,
        moves: [...currentGame.moves, move]
      };
    });
    setIsPlayerTurn(false);
    if (moveTimer) {
      clearTimeout(moveTimer);
    }
  };

  const handleSqaureClick = (figure: ChessSquare, row: number, col: number): void => {
    if (!isPlayerTurn || game?.status !== GameStatus.InProgress || opponentLeft) {
      return;
    }
    const isFigureWhite = Object.values(White).includes(figure);
    let isOwnFigure = (isWhitePlayer && isFigureWhite) || (!isWhitePlayer && !isFigureWhite);
    const isPossibleMove = checkIfPossibleMove(possibleMoves, row, col);
    if (isPossibleMove && selectedPiece) {
      const move: IMove = { srcRow: selectedPiece.currentRow, srcCol: selectedPiece.currentCol, destRow: row, destCol: col, figure: selectedPiece.figure };
      executeMove(move);
      setPossibleMoves([]);
      setSelectedPiece(null);
      socket.emit('sendMove', move, gameId);
    } else if (isOwnFigure && figure !== "None") {
      setSelectedPiece({ figure, currentRow: row, currentCol: col });
      const moves = calculatePossibleMoves(figure, row, col, game?.board);
      setPossibleMoves(moves);
    } else {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  if (errorToken) return <div>Error loading the game.</div>;
  if (!socket || isLoadingGameFromSocket || isLoadingToken || !game) {
    return <Loader />;
  }
  const renderBoard = (): JSX.Element[][] => {
    return game.board.map((row, rowIndex) =>
      row.map((figure, colIndex) => (
        <Square
          key={`${rowIndex}-${colIndex}`}
          onClick={() => handleSqaureClick(figure, rowIndex, colIndex)}
          isWhite={(rowIndex + colIndex) % 2 === 0}
          figure={figure}
          highlight={checkIfPossibleMove(possibleMoves, rowIndex, colIndex)}
          capture={checkCapture(possibleMoves, selectedPiece, rowIndex, colIndex, game.board)}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };
  return (
    <div className="flex flex-col md:flex-row justify-start items-center gap-3 h-full w-full py-2 px-2 md:px-4">
      <div className="grid grid-cols-8 gap-0">
        {renderBoard()}
      </div>
      <div className="flex flex-col justify-center">
        {!game.winner && game.whoIsInCheck && (
          <div className={`text-xl font-semibold ${game.whoIsInCheck === user._id ? 'text-red-500' : 'text-yellow-500'}`}>
            {game.whoIsInCheck === user._id ? 'You are in check!' : 'Opponent is in check!'}
          </div>
        )}
        {game.winner && (
          <div className={`text-xl font-semibold ${game.winner === user._id ? 'text-green-500' : 'text-red-500'}`}>
            {game.winner === user._id ? 'You won!' : 'You lost!'}
          </div>
        )}
        {opponentLeft && (
          <div className="text-xl font-semibold text-red">Opponent has left the game! You won!</div>
        )}
        {(game.status === GameStatus.WaitingForPlayer2 || game.status === GameStatus.WaitingForStart) && (
          <>
            {game.status === GameStatus.WaitingForPlayer2 &&
              <div className="text-xl font-semibold">Waiting for the opponent to join...</div>}
            {game.player1 === user._id ? (
              <div className='flex flex-col gap-2'>
                <div>Set move time limit(10s-300s):</div>
                <Input
                  type="number"
                  value={moveTimeInput}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setMoveTimeInput(value);
                  }}
                />
                <Button onClick={() => {
                  if (moveTimeInput < 10) {
                    setMoveTimeInput(10);
                  }
                  if (moveTimeInput > 300) {
                    setMoveTimeInput(300);
                  }
                  socket.emit('changeMoveTime', moveTimeInput, (message: string) => {
                    setMoveTimeMessage(message);
                    console.log(message);
                  })
                }}>Set</Button>
                <div>{moveTimeMessage}</div>
                {game.status === GameStatus.WaitingForStart &&
                  <Button onClick={() => {
                    socket.emit('startGame')
                  }}>Start game</Button>}
              </div>
            ) : (
              <div>{moveTimeMessage}</div>
            )}
          </>
        )}
        {game.status === GameStatus.InProgress && (
          <>
            {isWhitePlayer && <div className="text-xl font-semibold">You are playing white</div>}
            {!isWhitePlayer && <div className="text-xl font-semibold">You are playing black</div>}
            <div className="timer">
              {isPlayerTurn ? (
                <div>
                  <h2 className='text-green-400'>Your turn</h2>
                  <p>Time left: {timeLeft} seconds</p>
                </div>
              ) : (
                <div>
                  <h2 className='text-orange-400'>Opponent's turn</h2>
                  <p>Time left: {timeLeft} seconds</p>
                </div>
              )}
            </div>
            <div className="text-xl font-semibold">Moves:</div>
            <div className="flex flex-col gap-2">
              {game.moves.map((move, index) => (
                <div key={index} className="text-lg">{`${move.srcRow},${move.srcCol} -> ${move.destRow},${move.destCol}`}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

}

export default Board;