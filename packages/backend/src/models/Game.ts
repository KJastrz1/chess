import { initialBoard } from "@chess/types";
import mongoose, { Schema, Document } from "mongoose";

interface IMove {
    srcRow: number;
    srcCol: number;
    destRow: number;
    destCol: number;
    piece: string;
}

export interface IGame extends Document {
    player1: Schema.Types.ObjectId;
    player2: Schema.Types.ObjectId;
    board: string[][];
    whitePlayer: string;
    whosMove: string;
    moveTime: number;
    moves: IMove[];
    status: 'waiting' | 'in_progress' | 'finished';
    winner: 'player1' | 'player2' | 'draw' | null;
    createdAt: Date;
    updatedAt: Date;
}

const gameSchema = new Schema<IGame>({
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

export const Game = mongoose.model<IGame>('Game', gameSchema);

 