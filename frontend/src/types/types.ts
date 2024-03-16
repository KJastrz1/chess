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
    _id: string;
    username: string;
    email: string;
};

export type INewUser = {
    email: string;
    username: string;
    password: string;
};

export type IGame = {
    _id: string;
    player1: string;
    player1Name: string;
    player2: string;
    player2Name: string;
    status: string;
    whosMove: string;
    board: ChessSquare[][];
    winner: string;
    moveTime: number;
    whitePlayer: string;
    moves: IMove[];
};

export type IMove={
    srcRow: number;
    srcCol: number;
    destRow: number;
    destCol: number;
    figure: ChessSquare;
}

export type IGameListItem = {
    _id: string;
    player1: {
        _id: string;
        username: string;
    };
    moveTime?: number;
};