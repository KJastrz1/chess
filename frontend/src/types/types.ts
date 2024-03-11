import { ChessSquare } from "../enums/chessPieces";

export type INavLink = {   
    route: string;
    label: string;
};

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

export type IGame = {
    id: string;
    player1: string;
    player1Name: string;
    player2: string;
    player2Name: string;
};
