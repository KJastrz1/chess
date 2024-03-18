import { Server as SocketIOServer, Socket } from 'socket.io';


import { Game } from './models/Game';

export default (io: SocketIOServer) => {
    io.on('connection', (socket: Socket) => {
        console.log('Nowe połączenie:', socket.id);
        socket.on('joinGame', async (gameId, cb) => {
            try {
                const game = await Game.findOne({ _id: gameId });
                console.log(game)
                if (!game) {
                    console.log('Gra nie znaleziona');
                    cb('Game not found');
                }
                if (game.player1 === undefined) {
                    game.player2 = socket.id;
                    socket.join(gameId);
                    console.log('Gracz dołączył do gry:', gameId);
                    cb(`Joined game ${gameId}`)
                }

            } catch (error) {
                console.error('Błąd podczas dołączania do gry:', error);
                socket.emit('error', 'Wystąpił błąd podczas dołączania do gry');
            }
        })

        socket.on('sendMove', async ({ move, gameId, playerId, cb }) => {
            console.log('Ruch :', move);
            const game = await Game.findOne({ _id: gameId });
            if (!game) {
                console.log('Gra nie znaleziona');
                cb('Game not found');
                return;
            }
            if (game.player1 !== playerId && game.player2 !== playerId) {
                console.log('Gracz nie należy do gry');
                cb('Player not in game');
                return;
            }
            if (game.whosMove !== playerId) {
                console.log('Nie twoja kolej');
                cb('Not your turn');
                return;
            }


            const player = game.whitePlayer === playerId ? 'White' : 'Black';

            const { board } = game;

            if (!isMovePossible(board, move.srcRow, move.srcCol, move.destRow, move.destCol, player)) {
                console.log('Ruch niemożliwy');
                cb('Invalid move');
                return;
            }
            game.board[move.destRow][move.destCol] = game.board[move.srcRow][move.srcCol];
            game.board[move.srcRow][move.srcCol] = 'None';
            game.moves.push({ from: { row: move.srcRow, col: move.srcCol }, to: { row: move.destRow, col: move.destCol }, piece: board[move.destRow][move.destCol] });

            game.whosMove = game.whosMove === game.player1 ? game.player2 : game.player1;
            await game.save();


            io.to(gameId).emit('receiveMove', move);

        })
        socket.on('disconnect', (reason) => {
            console.log(`Klient rozłączony: ${socket.id}, Powód: ${reason}`);

        });
    })

}