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