export enum White {
    Pawn = "White_Pawn",
    Knight = "White_Horse",
    Bishop = "White_Bishop",
    Rook = "White_Tower",
    Queen = "White_Queen",
    King = "White_King",
}

export enum Black {
    Pawn = "Black_Pawn",
    Knight = "Black_Horse",
    Bishop = "Black_Bishop",
    Rook = "Black_Tower",
    Queen = "Black_Queen",
    King = "Black_King",
}

export const None = "None";

export type ChessSquare = Black | White | "None";