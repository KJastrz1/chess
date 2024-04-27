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

export type ChessSquare = Black | White | typeof None;

export const initialBoard: ChessSquare[][] = [
    [Black.Rook, Black.Knight, Black.Bishop, Black.Queen, Black.King, Black.Bishop, Black.Knight, Black.Rook],
    [Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn],
    ["None", "None", "None", "None", "None", "None", "None", "None"],
    ["None", "None", "None", "None", "None", "None", "None", "None"],
    ["None", "None", "None", "None", "None", "None", "None", "None"],
    ["None", "None", "None", "None", "None", "None", "None", "None"],
    [White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn],
    [White.Rook, White.Knight, White.Bishop, White.Queen, White.King, White.Bishop, White.Knight, White.Rook]
];

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

//================================================
// USER TYPES
//================================================
export type IUser = {
    _id: string;
    username: string;
    email: string;
};
export type ILoginUser = {
    email: string;
    password: string;
};

export type INewUser = {
    email: string;
    username: string;
    password: string;
};

//================================================
// GAME TYPES
//================================================
export type IGame = {
    _id: string;
    player1: string;
    player2: string;
    board: ChessSquare[][];
    whitePlayer: string;
    whosMove: string;
    moveTime: number;
    moves: IMove[];
    status: GameStatus;
    player1Connected: boolean;
    player2Connected: boolean;
    winner: string | 'draw' | null;
};

export type IMove = {
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

export enum GameStatus {
    WaitingForPlayer2 = 'waiting_for_player2',
    WaitingForStart = 'waiting',
    InProgress = 'in_progress',
    Finished = 'finished'
}