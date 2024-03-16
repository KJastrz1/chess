const mongoose = require("mongoose");
const { initialBoard } = require("../consts/chessPieces");
const Schema = mongoose.Schema;
const model = mongoose.model;


const gameSchema = new Schema({
    player1: { type: Schema.Types.ObjectId, ref: 'User' },
    player2: { type: Schema.Types.ObjectId, ref: 'User' },
    board: {
        type: [[String]],
        required: true,
        default: initialBoard
    },
    whitePlayer: { type: String },
    whosMove: { type: String },
    moveTime: { type: Number, default: 180, required: true },
    moves: [{
        srcRow: { type: Number },
        srcCol: { type: Number },
        destRow: { type: Number },
        destCol: { type: Number },
        piece: { type: String },
    }],
    status: { type: String, required: true, enum: ['waiting', 'in_progress', 'finished'], default: 'waiting' },
    winner: { type: String, enum: ['player1', 'player2', 'draw', null], default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Game = model('Game', gameSchema);

module.exports = Game;