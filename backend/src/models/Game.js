const mongoose = require("mongoose");
const initialBoard = require("../consts/chessPieces");
const Schema = mongoose.Schema;
const model = mongoose.model;


const gameSchema = new Schema({
    player1: { type: String, required: true },
    player2: { type: String },
    board: {
        type: [[String]],
        required: true,        
    },
    whosMove: { type: String, required: true, enum: ['player1', 'player2'], default: 'player1' },
    moves: [{
        from: { row: Number, col: Number },
        to: { row: Number, col: Number },
        piece: { type: String },
    }],
    status: { type: String, required: true, enum: ['waiting', 'in_progress', 'finished'], default: 'waiting' },
    winner: { type: String, enum: ['player1', 'player2', 'draw', null], default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Game = model('Game', gameSchema);

module.exports = Game;