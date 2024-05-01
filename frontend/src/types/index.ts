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
export type IUserResponse = {
    _id: string;
    username: string;
    email: string;
    eloRating: number;
};
export type ILoginUserRequest = {
    email: string;
    password: string;
};

export type IRegisterUserRequest = {
    email: string;
    username: string;
    password: string;
};

export type IUserProfileResponse = {
    _id: string;
    username: string;
    eloRating: number;
};

export type IRankingParams = {
    username?: string;
    minEloRating?: string;
    maxEloRating?: string;
    page?: string;
    itemsPerPage?: string;
};

export type IPaginetedResult<T> = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: T[];
}

//================================================
// GAME TYPES
//================================================
export type IGame = {
    _id: string;
    player1: IUserProfileResponse;
    player2: IUserProfileResponse | null;
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

export type IGameParams = {
    player1?: string;
    player2?: string;
    status: GameStatus.WaitingForPlayer2 | GameStatus.WaitingForStart;
    moveTime?: string;
    winner?: string;
    player1Username?: string;
    player2Username?: string;
    updatedAt?: string;
    createdAt?: string;
};

export type IGameHistoryParams = {
    status: GameStatus.Finished;
    moveTime?: string;
    winner?: string;
    result?: 'won' | 'lost' | 'draw';
    opponentUsername?: string;   
    updatedAt?: string;
    createdAt?: string;
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
        eloRating: number;
    };
    winner: string | 'draw' | null;
    moveTime: number;
};

export enum GameStatus {
    WaitingForPlayer2 = 'waiting_for_player2',
    WaitingForStart = 'waiting_for_start',
    InProgress = 'in_progress',
    Finished = 'finished'
}
