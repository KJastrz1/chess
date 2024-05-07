
import jwt from 'jsonwebtoken';
import { Game } from './models/Game';
import { IUserModel, User } from './models/User';
import { GameStatus, IGameResponse, IMove } from './types';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { isCheck, isCheckmate, isMovePossible } from './utils/chessLogic';
import { updateEloRating } from './services/UserService';



const disconnectionTimers: Record<string, NodeJS.Timeout> = {};
const moveTimers: Record<string, NodeJS.Timeout> = {};

export default (io: SocketIOServer) => {
    io.use(async (socket: Socket, next: any) => {

        const { token } = socket.handshake.auth.token;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

                socket.data.user = await User.findById(decoded._id);

                if (!socket.data.user) {
                    next(new Error('User not found'));
                }

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

                const playerId: string = socket.data.user._id.toString();

                if (disconnectionTimers[playerId]) {
                    clearTimeout(disconnectionTimers[playerId]);
                    delete disconnectionTimers[playerId];
                }

                const game = await Game.findById(gameId).populate('player1', 'username eloRating rankingPlace').populate('player2', 'username eloRating rankingPlace');

                if (!game) {
                    console.log("game not found")
                    cb('Game not found');
                    return;
                }

                if (game.player1._id.toString() !== playerId
                    && game.status === GameStatus.WaitingForPlayer2) {

                    game.player2 = await User.findById(socket.data.user._id).select('username eloRating rankingPlace') as IUserModel;

                    if (!game.player2) {
                        console.log("player2 not found")
                        return;
                    }
                    const players = [game.player1._id, game.player2._id];
                    const whitePlayerIndex = Math.floor(Math.random() * players.length);
                    game.whitePlayer = players[whitePlayerIndex];
                    game.whosMove = game.whitePlayer;
                    game.status = GameStatus.WaitingForStart;
                }

                if (game.player1._id.toString() !== playerId
                    && game.player2 && game.player2._id.toString() !== playerId) {
                    console.log("player not assigned to this game")
                    cb('Player not assigned to this game');
                    return;
                }

                if (game.player1._id.toString() === playerId) {
                    game.player1Connected = true;
                }
                if (game.status !== GameStatus.WaitingForPlayer2 && game.player2 && game.player2._id.toString() === playerId) {
                    game.player2Connected = true;
                }
                socket.data.gameId = gameId;
                socket.join(gameId);

                await Game.findByIdAndUpdate(gameId, game);
                io.to(gameId).emit('receiveGame', game);

            } catch (error) {
                cb('Error joining the game');
            }
        });

        socket.on('sendMove', async (move: IMove, gameId: string, cb: (message: string) => void) => {
            try {
                const playerId: string = socket.data.user._id.toString();
                const game = await Game.findById(gameId).populate('player1', 'username eloRating rankingPlace').populate('player2', 'username eloRating rankingPlace');
                if (!game) {
                    cb('Game not found');
                    return;
                }
                if (!game.player2) {
                    cb('No player2 assigned to this game');
                    return;
                }
                if (game.player1._id.toString() !== playerId
                    && game.player2._id.toString() !== playerId) {
                    cb("Player not assigned to this game")
                    return;
                }
                if (game.whosMove.toString() !== playerId) {
                    cb('Not your turn');
                    return;
                }

                const player = game.whitePlayer.toString() === playerId ? 'White' : 'Black';
                const opponent = player === 'White' ? 'Black' : 'White';

                if (!isMovePossible(game.board, move, player)) {
                    return;
                }
                game.board[move.destRow][move.destCol] = game.board[move.srcRow][move.srcCol];
                game.board[move.srcRow][move.srcCol] = 'None';
                game.moves.push(move);
                game.whosMove = game.whosMove.toString() === game.player1._id.toString() ? game.player2._id : game.player1._id;

                if (isCheckmate(game.board, opponent)) {
                    game.winner = playerId === game.player1._id.toString() ? game.player1._id : game.player2._id;

                    const loser = game.player1._id.toString() !== playerId ? game.player1._id : (game.player2 as IUserModel)._id;
                    game.status = GameStatus.Finished;
                    await updateEloRating(game.winner, loser);
                    await Game.findByIdAndUpdate(gameId, game);
                    io.to(gameId).emit('receiveGame', game);
                    clearDisconnectionTimer(game.player1.toString());
                    clearDisconnectionTimer((game.player2 as IUserModel).toString());
                    clearMoveTimer(gameId);
                    return;
                }

                if (isCheck(game.board, opponent)) {
                    game.whoIsInCheck = game.whosMove;
                } else {
                    game.whoIsInCheck = null;
                }

                const gameToSend: IGameResponse = {
                    ...game.toObject(),
                    whoIsInCheck: game.whoIsInCheck ? game.whoIsInCheck.toString() : null,
                };
                clearMoveTimer(gameId);
                startMoveTimer(gameId, game.moveTime);
                await Game.findByIdAndUpdate(gameId, game);
                io.to(gameId).emit('receiveGame', gameToSend);
            } catch (error) {
                console.error(error);
            }
        })

        socket.on('changeMoveTime', async (moveTime: number, cb: (message: string) => void) => {
            try {
                const gameId = socket.data.gameId;
                const game = await Game.findById(gameId).populate('player1', 'username eloRating rankingPlace').populate('player2', 'username eloRating rankingPlace');
                if (!game) {
                    cb('Game not found');
                    return;
                }
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

                    await Game.findByIdAndUpdate(gameId, game);
                    io.to(gameId).emit('receiveGame', game);

                }
            } catch (error) {
                console.error(error);
            }
        })

        socket.on('startGame', async () => {
            try {
                const gameId = socket.data.gameId;
                const game = await Game.findById(gameId).populate('player1', 'username eloRating rankingPlace').populate('player2', 'username eloRating rankingPlace');
                if (!game) {
                    return;
                }
                game.status = GameStatus.InProgress;
                startMoveTimer(gameId, game.moveTime);
                await Game.findByIdAndUpdate(gameId, game);
                io.to(gameId).emit('receiveGame', game);

            } catch (error) {
                console.error(error);
            }
        });

        socket.on('disconnect', async (reason) => {
            try {
                const gameId = socket.data.gameId;
                const game = await Game.findById(gameId).populate('player1', 'username eloRating rankingPlace').populate('player2', 'username eloRating rankingPlace');

                if (!game || !game.player2) {
                    return;
                }

                const playerId: string = socket.data.user._id.toString();
                if (game.status === GameStatus.WaitingForStart && playerId === game.player2._id.toString()) {
                    game.status = GameStatus.WaitingForPlayer2;
                    game.player2Connected = false;
                    socket.to(gameId).emit('receiveGame', game);
                    await Game.findByIdAndUpdate(gameId, game);
                }
                else if ((game.status === GameStatus.WaitingForPlayer2 || game.status === GameStatus.WaitingForStart) && playerId === game.player1._id.toString()) {
                    await Game.findByIdAndDelete(gameId);
                } else {
                    disconnectionTimers[playerId] = setTimeout(async () => {
                        socket.to(gameId).emit('playerLeft');

                        game.winner = game.player1._id.toString() === playerId ? (game.player2 as IUserModel)._id : game.player1._id;

                        game.status = GameStatus.Finished;
                        const loser = game.player1._id.toString() === playerId ? game.player1._id : (game.player2 as IUserModel)._id;
                        try {
                            await updateEloRating(game.winner, loser);
                            await Game.findByIdAndUpdate(gameId, game);
                        } catch (error) {
                            console.error(`Błąd podczas aktualizacji gry ${gameId}:`, error);
                        }
                        clearDisconnectionTimer(game.player1.toString());
                        clearDisconnectionTimer((game.player2 as IUserModel).toString());
                        clearMoveTimer(gameId);
                    }, 30000);
                }
            } catch (error) {
                console.error(error);
            }
        });

        const startMoveTimer = (gameId: string, moveTime: number) => {
            const timeoutId = setTimeout(async () => {
                try {
                    const game = await Game.findById(gameId).populate('player1', 'username eloRating rankingPlace').populate('player2', 'username eloRating rankingPlace');
                    if (game) {
                        game.whosMove = game.whosMove.toString() === game.player1._id.toString() ? (game.player2 as IUserModel)._id : game.player1._id;
                        startMoveTimer(gameId, moveTime);
                        await Game.findByIdAndUpdate(gameId, game)
                        io.to(gameId).emit('timeOut', { newTurn: game.whosMove });
                    }
                } catch (error) {
                    console.error(error);
                }
            }, moveTime * 1000);
            moveTimers[gameId] = timeoutId;
        };

        const clearMoveTimer = (gameId: string) => {
            if (moveTimers[gameId]) {
                clearTimeout(moveTimers[gameId]);
                delete moveTimers[gameId];
            }
        };

        const clearDisconnectionTimer = (playerId: string) => {
            if (disconnectionTimers[playerId]) {
                clearTimeout(disconnectionTimers[playerId]);
                delete disconnectionTimers[playerId];
            }
        }
    })
}