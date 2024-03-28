
import jwt from 'jsonwebtoken';
import { Game, IGameModel } from './models/Game';
import { IUserModel, User } from './models/User';
import { IMove } from './types';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { isMovePossible } from './utils/chessLogic';

const gamesState: Record<string, IGameModel> = {};

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
                console.log('token poprawny');
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
                console.log('user o id:', socket.data.user._id, " dolaczyl do gry o id: ", gameId);
                const game: IGameModel | null = await Game.findOne({ _id: gameId });
                // console.log('game:player2', game?.player2);                
                if (!game) {
                    console.log('Gra nie znaleziona');
                    cb('Game not found');
                    return;
                }
                if (game.player1.toString() !== socket.data.user._id.toString()
                    && game.player2 === null) {
                    game.player2 = socket.data.user._id;
                    game.status = 'in_progress';
                    console.log('Gracz dolaczyl do gry jako drugi');

                    const players = [game.player1, game.player2];
                    const whitePlayerIndex = Math.floor(Math.random() * players.length);
                    game.whitePlayer = players[whitePlayerIndex];
                    game.whosMove = game.whitePlayer;
                    console.log('Gracz bialy:', game.whitePlayer);
                    console.log('Gracz wykonujacy ruch:', game.whosMove);
                }

                if (game.player1.toString() !== socket.data.user._id.toString()
                    && game.player2.toString() !== socket.data.user._id.toString()) {
                    console.log('Gracz nie należy do gry');
                    cb('Player not assigned to this game');
                    return;
                }

                gamesState[gameId] = game;

                socket.data.gameId = gameId;
                socket.join(gameId);
                io.to(gameId).emit('receiveGame', game);
            } catch (error) {
                console.error('Błąd podczas dołączania do gry:', error);
                cb('Error joining the game');
            }
        });

        socket.on('sendMove', async (move: IMove, gameId: string, cb: (message: string) => void) => {
            console.log('Ruch :', move);
            const game: IGameModel | null = gamesState[gameId];
            if (!game) {
                console.log('Gra nie znaleziona');
                cb('Game not found');
                return;
            }
            if (game.player1.toString() !== socket.data.user._id.toString()
                && game.player2.toString() !== socket.data.user._id.toString()) {
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

            const { board } = game;

            if (!isMovePossible(board, move, player)) {
                console.log('Ruch niemożliwy');
                cb('Invalid move');
                return;
            }
            game.board[move.destRow][move.destCol] = game.board[move.srcRow][move.srcCol];
            game.board[move.srcRow][move.srcCol] = 'None';
            game.moves.push(move);

            game.whosMove = game.whosMove === game.player1 ? game.player2 : game.player1;

            socket.to(gameId).emit('receiveMove', move);
        })

        socket.on('disconnect', async (reason) => {
            console.log(`User rozłączony: ${socket.data.user._id}, Powód: ${reason}`);

            const gameId = socket.data.gameId;
            socket.to(gameId).emit('playerLeft');
            if (gameId && gamesState[gameId]) {
                const gameToUpdate = gamesState[gameId];


                try {
                    const game = await Game.findByIdAndUpdate(gameId, gameToUpdate);
                    console.log(`Gra ${gameId} zaktualizowana po rozłączeniu klienta.`);
                } catch (error) {
                    console.error(`Błąd podczas aktualizacji gry ${gameId}:`, error);
                }
            }
        });
    })

}