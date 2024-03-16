export enum White {
    Pawn = "wp",
    Knight = "wn",
    Bishop = "wb",
    Rook = "wr",
    Queen = "wq",
    King = "wk",
}

export enum Black {
    Pawn = "bp",
    Knight = "bn",
    Bishop = "bb",
    Rook = "br",
    Queen = "bq",
    King = "bk",
}

export const None = "None";

export type ChessSquare = Black | White | "None";