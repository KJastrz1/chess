
import jwt from 'jsonwebtoken';
import { Game, IGameModel } from './models/Game';
import { IUserModel, User } from './models/User';
import { GameStatus, IMove } from './types';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { isMovePossible } from './utils/chessLogic';
import { updateEloRating } from './controllers/UserController';

const gamesState: Record<string, IGameModel> = {};
const disconnectionTimers: Record<string, NodeJS.Timeout> = {};

interface SocketData {
    user: IUserModel | null;
}


export default (io: SocketIOServer) => {
    io.use(async (socket: Socket, next: any) => {
        // console.log('handshake token:', socket.handshake.auth.token);
        const { token } = socket.handshake.auth.token;
        // console.log('token:', token);
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

                socket.data.user = await User.findById(decoded._id);

                if (!socket.data.user) {
                    next(new Error('User not found'));
                }
                // console.log('token poprawny');
                next();
            } catch (error) {
                console.error(error);
                next(new Error('Invalid token'));
            }
        } else {
            next(new Error('No token provided'));
        }
    });

    io.on('connection', (socket: Socket) => {
        socket.on('joinGame', async (gameId: string, cb: (message: string) => void) => {
            try {
                const playerId = socket.data.user._id.toString();
                if (disconnectionTimers[playerId]) {
                    clearTimeout(disconnectionTimers[playerId]);
                    delete disconnectionTimers[playerId];
                }
                console.log('user o id:', playerId, " dolaczyl do gry o id: ", gameId);
                let game: IGameModel | null;
                if (gamesState[gameId]) {
                    game = gamesState[gameId];
                } else {
                    game = await Game.findOne({ _id: gameId });
                }
                // console.log('game:player2', game?.player2);                
                if (!game) {
                    console.log('Gra nie znaleziona');
                    cb('Game not found');
                    return;
                }
                if (game.player1.toString() !== playerId
                    && game.status === GameStatus.WaitingForPlayer2) {
                    game.player2 = socket.data.user._id;
                    console.log('Gracz dolaczyl do gry jako drugi');
                    const players = [game.player1, game.player2];
                    const whitePlayerIndex = Math.floor(Math.random() * players.length);
                    game.whitePlayer = players[whitePlayerIndex];
                    game.whosMove = game.whitePlayer;
                    game.status = GameStatus.WaitingForStart;
                    console.log('Gracz bialy:', game.whitePlayer);
                    console.log('Gracz wykonujacy ruch:', game.whosMove);
                }

                if (game.player1.toString() !== playerId
                    && game.player2 && game.player2.toString() !== playerId) {
                    console.log('Gracz nie należy do gry');
                    cb('Player not assigned to this game');
                    return;
                }

                if (game.player1.toString() === playerId) {
                    game.player1Connected = true;
                }
                if (game.status !== GameStatus.WaitingForPlayer2 && game.player2.toString() === playerId) {
                    game.player2Connected = true;
                }

                gamesState[gameId] = game;

                socket.data.gameId = gameId;
                socket.join(gameId);
                const gameToSend = {
                    ...game.toObject(),
                    player1Connected: game.player1Connected,
                    player2Connected: game.player2Connected
                };
                io.to(gameId).emit('receiveGame', gameToSend);
            } catch (error) {
                console.error('Błąd podczas dołączania do gry:', error);
                cb('Error joining the game');
            }
        });

        socket.on('sendMove', async (move: IMove, gameId: string, cb: (message: string) => void) => {
            const playerId = socket.data.user._id.toString();
            console.log("ruch od gracza", socket.data.user._id)
            const game: IGameModel | null = gamesState[gameId];
            if (!game) {
                console.log('Gra nie znaleziona');
                cb('Game not found');
                return;
            }
            if (game.player1.toString() !== playerId
                && game.player2.toString() !== playerId) {
                console.log('Gracz nie należy do gry');
                cb('Player not assigned to this game');
                return;
            }
            if (game.whosMove.toString() !== socket.data.user._id.toString()) {
                console.log('Not your turn');
                cb('Not your turn');
                return;
            }

            const player = game.whitePlayer.toString() === socket.data.user._id.toString() ? 'White' : 'Black';

            if (!isMovePossible(game.board, move, player)) {
                console.log('Ruch niemożliwy');
                cb('Invalid move');
                return;
            }
            game.board[move.destRow][move.destCol] = game.board[move.srcRow][move.srcCol];
            game.board[move.srcRow][move.srcCol] = 'None';
            game.moves.push(move);

            game.whosMove = game.whosMove.toString() === game.player1.toString() ? game.player2 : game.player1;

            gamesState[gameId] = game;
            const gameToSend = {
                ...game.toObject(),
                player1Connected: game.player1Connected,
                player2Connected: game.player2Connected
            };
            clearMoveTimer(gameId);
            startMoveTimer(gameId, game.moveTime);
            socket.to(gameId).emit('receiveGame', gameToSend);
        })

        socket.on('changeMoveTime', async (moveTime: number, cb: (message: string) => void) => {
            const gameId = socket.data.gameId;
            const game = gamesState[gameId];
            if (game.status !== GameStatus.WaitingForPlayer2 && game.status !== GameStatus.WaitingForStart) {
                cb('You can only change time limit before game started');
                return;
            }
            if (game) {
                if (moveTime < 10) {
                    moveTime = 10;
                }
                if (moveTime > 300) {
                    moveTime = 300;
                }
                game.moveTime = moveTime;
                cb("Time limit set to " + moveTime + " seconds")
                socket.to(gameId).emit('receiveGame', game);
                await Game.findByIdAndUpdate(gameId, game);
            }
        })

        socket.on('startGame', async () => {
            const gameId = socket.data.gameId;
            const game = gamesState[gameId];
            if (game) {
                game.status = GameStatus.InProgress;
                io.to(gameId).emit('receiveGame', game);
                startMoveTimer(gameId, game.moveTime);
            }
        });

        socket.on('disconnect', async (reason) => {
            console.log(`User rozłączony: ${socket.data.user._id}, Powód: ${reason}`);

            const gameId = socket.data.gameId;
            const game = gamesState[gameId];
            if (!gameId || !gamesState[gameId]) {
                return;
            }

            const playerId = socket.data.user._id.toString();
            if (game.status === GameStatus.WaitingForStart && playerId === game.player2.toString()) {
                game.status = GameStatus.WaitingForPlayer2;
                game.player2Connected = false;
                socket.to(gameId).emit('receiveGame', game);
            }
            else if ((game.status === GameStatus.WaitingForPlayer2 || game.status === GameStatus.WaitingForStart) && playerId === game.player1.toString()) {
                delete gamesState[gameId];
                await Game.findByIdAndDelete(gameId);
            } else {
                disconnectionTimers[playerId] = setTimeout(async () => {
                    socket.to(gameId).emit('playerLeft');

                    game.winner = game.player1.toString() === playerId ? game.player2 : game.player1;
                    game.status = GameStatus.Finished;
                    const loser = game.player1.toString() === playerId ? game.player1 : game.player2;
                    delete gamesState[gameId];
                    try {
                        await updateEloRating(game.winner, loser);
                        await Game.findByIdAndUpdate(gameId, game);
                        console.log(`Gra ${gameId} zaktualizowana po rozłączeniu klienta.`);
                    } catch (error) {
                        console.error(`Błąd podczas aktualizacji gry ${gameId}:`, error);
                    }
                    clearMoveTimer(gameId);
                    console.log(`Gra ${gameId} zaktualizowana po rozłączeniu klienta.`);
                }, 30000);
            }
        }
        );

        const startMoveTimer = (gameId: string, moveTime: number) => {
            const timeoutId = setTimeout(() => {
                const game = gamesState[gameId];
                if (game) {
                    game.whosMove = game.whosMove.toString() === game.player1.toString() ? game.player2 : game.player1;
                    console.log(`Czas na ruch minął, teraz kolej na: ${game.whosMove}`);
                    startMoveTimer(gameId, moveTime);
                    io.to(gameId).emit('timeOut', { newTurn: game.whosMove });
                }
            }, moveTime * 1000);

            gamesState[gameId].timer = timeoutId;
        };

        const clearMoveTimer = (gameId: string) => {
            const game = gamesState[gameId];
            if (game && game.timer) {
                clearTimeout(game.timer);
                game.timer = null;
            }
        };
    })

}