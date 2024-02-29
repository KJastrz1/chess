const Game = require('./models/Game');
const { instrument } = require('@socket.io/admin-ui');

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinGame', async (gameId, cb) => {
            try {
                const game = await Game.findOne({ _id: gameId });
                if (game) {
                    socket.join(gameId);
                    console.log('Gracz dołączył do gry:', gameId);
                    cb(`Joined game ${gameId}`)

                } else {
                    cb('Game not found');
                }
            } catch (error) {
                console.error('Błąd podczas dołączania do gry:', error);
                socket.emit('error', 'Wystąpił błąd podczas dołączania do gry');
            }
        })

        socket.on('sendMessage', ({ message, gameId }) => {
            console.log('Wiadomość:', message);
            io.to(gameId).emit('receiveMessage', message);

        })
    })
    instrument(io, { auth: false });
}