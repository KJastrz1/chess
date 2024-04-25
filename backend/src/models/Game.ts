import { ChessSquare, IMove, initialBoard, GameStatus as GameStatus } from '../types/index';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGameModel extends Document {
    _id: Types.ObjectId;
    player1: Types.ObjectId;
    player2: Types.ObjectId;
    board: ChessSquare[][];
    whitePlayer: Types.ObjectId;
    whosMove: Types.ObjectId;
    moveTime: number;
    moves: IMove[];
    status: GameStatus;
    player1Connected: boolean;
    player2Connected: boolean;
    winner: Types.ObjectId | 'draw' | null;
    createdAt: Date;
    updatedAt: Date;
}

const gameSchema = new Schema<IGameModel>({
    player1: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    player2: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    board: {
        type: [[String]],
        required: true,
        default: initialBoard
    },
    whitePlayer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    whosMove: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    moveTime: { type: Number, default: 180, required: true },
    moves: [{
        srcRow: { type: Number },
        srcCol: { type: Number },
        destRow: { type: Number },
        destCol: { type: Number },
        figure: { type: String },
    }],
    status: { type: String, required: true, default: 'waiting' },
    winner: { type: Schema.Types.ObjectId, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

gameSchema.pre<IGameModel>('save', function (next: any) {
    this.updatedAt = new Date();
    next();
});

export const Game = mongoose.model<IGameModel>('Game', gameSchema);

