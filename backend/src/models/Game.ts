import { ChessSquare, IMove, initialBoard, GameStatus } from '../types/index';
import mongoose, { Schema, Document, Types } from "mongoose";
import { IUserModel } from './User';

export interface IGameModel extends Document {
    _id: Types.ObjectId;
    player1: IUserModel;
    player2: IUserModel|null;
    whitePlayer: Types.ObjectId;
    whosMove: Types.ObjectId;
    moveTime: number;
    whoIsInCheck: Types.ObjectId | null;
    moves: IMove[];
    status: GameStatus;
    player1Connected: boolean;
    player2Connected: boolean;
    winner: Types.ObjectId | 'draw' | null;
    createdAt: Date;
    updatedAt: Date;
    board: ChessSquare[][];
}

const gameSchema = new Schema<IGameModel>({
    player1: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    player2: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    whitePlayer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    whosMove: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    moveTime: { type: Number, default: 180, required: true },
    whoIsInCheck: { type: Schema.Types.ObjectId, default: null },
    moves: [{
        srcRow: { type: Number },
        srcCol: { type: Number },
        destRow: { type: Number },
        destCol: { type: Number },
        figure: { type: String },
    }],
    status: { type: String, required: true, enum: Object.values(GameStatus), default: GameStatus.WaitingForPlayer2 },
    player1Connected: { type: Boolean, default: false },
    player2Connected: { type: Boolean, default: false },
    winner: { type: Schema.Types.ObjectId, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    board: {
        type: [[String]],
        required: true,
        default: initialBoard
    },
});

gameSchema.pre<IGameModel>('save', function (next: any) {
    this.updatedAt = new Date();
    next();
});

export const Game = mongoose.model<IGameModel>('Game', gameSchema);

