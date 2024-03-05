import { ChessSquare } from "../enums/chessPieces";

export type PossibleMove = {
    row: number;
    col: number;
}


export type SelectedPiece = {
    figure: ChessSquare;
    currentRow: number;
    currentCol: number;
}


export type IUser = {
    id: string;
    username: string;
    email: string;
};

export type INewUser = {   
    email: string;
    username: string;
    password: string;
  };
  