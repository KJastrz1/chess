const Game = require('./models/Game');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Nowe połączenie:', socket.id);
        socket.on('joinGame', async (gameId, cb) => {
            try {
                const game = await Game.findOne({ _id: gameId });
                console.log(game)
                if (game) {
                    socket.join(gameId);
                    console.log('Gracz dołączył do gry:', gameId);
                    cb(`Joined game ${gameId}`)

                } else {
                    console.log('Gra nie znaleziona');
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
        socket.on('disconnect', (reason) => {
            console.log(`Klient rozłączony: ${socket.id}, Powód: ${reason}`);
            
        });
    })

}