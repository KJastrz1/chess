export enum White {
    Pawn = "White_Pawn",
    Knight = "White_Knight",
    Bishop = "White_Bishop",
    Rook = "White_Rook",
    Queen = "White_Queen",
    King = "White_King",
}

export enum Black {
    Pawn = "Black_Pawn",
    Knight = "Black_Knight",
    Bishop = "Black_Bishop",
    Rook = "Black_Rook",
    Queen = "Black_Queen",
    King = "Black_King",
}

export const None = "None";

export type ChessSquare = Black | White | "None";