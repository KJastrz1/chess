import { ChessSquare, IMove } from "@src/types";

export function isMovePossible(board: ChessSquare[][], move: IMove, player: "White" | "Black"): boolean {
    const piece = board[move.srcRow][move.srcCol];

    if (piece === 'None') {
        console.error('No piece at source position.');
        return false;
    }

    const isWhite = player === 'White';
    const opponent = isWhite ? 'b' : 'w';
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;
    let isPossible = false;

    switch (piece[1]) {
        case 'p':
            isPossible = isPawnMovePossible(board, move, direction, startRow, opponent);
            break;
        case 'n':
            isPossible = isKnightMovePossible(board, move, opponent);
            break;
        case 'b':
            isPossible = isBishopMovePossible(board, move, opponent);
            break;
        case 'r':
            isPossible = isRookMovePossible(board, move, opponent);
            break;
        case 'q':
            isPossible = isQueenMovePossible(board, move, opponent);
            break;
        case 'k':
            isPossible = isKingMovePossible(board, move, opponent);
            break;
        default:
            isPossible = false;
    }

    return isPossible && !doesMoveCauseOwnCheck(board, move, player);
}

export function isPawnMovePossible(board: ChessSquare[][], move: IMove, direction: number, startRow: number, opponent: "w" | "b"): boolean {
    const { srcRow, srcCol, destRow, destCol } = move;

    if (srcCol === destCol && srcRow + direction === destRow && board[destRow][destCol] === 'None') {
        return true;
    }

    if (srcCol === destCol && srcRow === startRow && srcRow + 2 * direction === destRow && board[destRow][destCol] === 'None' && board[srcRow + direction][srcCol] === 'None') {
        return true;
    }

    if (Math.abs(srcCol - destCol) === 1 && srcRow + direction === destRow && board[destRow][destCol][0] === opponent) {
        return true;
    }

    return false;
}


export function isKnightMovePossible(board: ChessSquare[][], move: IMove, opponent: "w" | "b"): boolean {
    const { srcRow, srcCol, destRow, destCol } = move;
    const rowDiff = Math.abs(srcRow - destRow);
    const colDiff = Math.abs(srcCol - destCol);

    const isValidMove = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    if (!isValidMove) return false;

    const targetPiece = board[destRow][destCol];
    return targetPiece === 'None' || targetPiece[0] === opponent;
}


export function isBishopMovePossible(board: ChessSquare[][], move: IMove, opponent: "w" | "b"): boolean {
    const { srcRow, srcCol, destRow, destCol } = move;
    if (Math.abs(destRow - srcRow) !== Math.abs(destCol - srcCol)) return false;

    const rowDirection = destRow > srcRow ? 1 : -1;
    const colDirection = destCol > srcCol ? 1 : -1;

    for (let step = 1; step < Math.abs(destRow - srcRow); step++) {
        if (board[srcRow + step * rowDirection][srcCol + step * colDirection] !== 'None') return false;
    }

    const destinationPiece = board[destRow][destCol];
    return destinationPiece === 'None' || destinationPiece[0] === opponent;
}

export function isRookMovePossible(board: ChessSquare[][], move: IMove, opponent: "w" | "b"): boolean {
    const { srcRow, srcCol, destRow, destCol } = move;
    if (srcRow !== destRow && srcCol !== destCol) return false;

    const rowDirection = destRow === srcRow ? 0 : (destRow > srcRow ? 1 : -1);
    const colDirection = destCol === srcCol ? 0 : (destCol > srcCol ? 1 : -1);

    const maxSteps = Math.max(Math.abs(destRow - srcRow), Math.abs(destCol - srcCol));
    for (let step = 1; step < maxSteps; step++) {
        if (board[srcRow + step * rowDirection][srcCol + step * colDirection] !== 'None') return false;
    }

    const destinationPiece = board[destRow][destCol];
    return destinationPiece === 'None' || destinationPiece[0] === opponent;
}

export function isQueenMovePossible(board: ChessSquare[][], move: IMove, opponent: "w" | "b"): boolean {

    return isRookMovePossible(board, move, opponent) || isBishopMovePossible(board, move, opponent);
}

export function isKingMovePossible(board: ChessSquare[][], move: IMove, opponent: "w" | "b"): boolean {
    const { srcRow, srcCol, destRow, destCol } = move;
    if (Math.abs(srcRow - destRow) > 1 || Math.abs(srcCol - destCol) > 1) return false;

    const destinationPiece = board[destRow][destCol];
    return destinationPiece === 'None' || destinationPiece[0] === opponent;
}


export function findKingPosition(board: ChessSquare[][], player: "White" | "Black") {
    const kingSymbol = player === 'White' ? 'wk' : 'bk';
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === kingSymbol) {
                return { row, col };
            }
        }
    }
    return null;
}


export function isSquareAttackedByOpponent(board: ChessSquare[][], destRow: number, destCol: number, opponent: "w" | "b") {

    const pawnMoveDirection = opponent === 'w' ? 1 : -1;
    if (destRow + pawnMoveDirection >= 0 && destRow + pawnMoveDirection < 8) {
        if (destCol - 1 >= 0 && board[destRow + pawnMoveDirection][destCol - 1] === opponent + 'p') {
            return true;
        }
        if (destCol + 1 < 8 && board[destRow + pawnMoveDirection][destCol + 1] === opponent + 'p') {
            return true;
        }
    }


    const knightMoves = [
        { row: -2, col: -1 }, { row: -2, col: 1 },
        { row: -1, col: -2 }, { row: -1, col: 2 },
        { row: 1, col: -2 }, { row: 1, col: 2 },
        { row: 2, col: -1 }, { row: 2, col: 1 }
    ];
    for (let move of knightMoves) {
        const newRow = destRow + move.row;
        const newCol = destCol + move.col;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && board[newRow][newCol] === opponent + 'n') {
            return true;
        }
    }


    const lineMoves = [
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 }
    ];
    if (isAttackedByLineMover(board, destRow, destCol, opponent, lineMoves)) {
        return true;
    }

    const diagonalMoves = [
        { row: -1, col: -1 }, { row: -1, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 1 }
    ];
    if (isAttackedByLineMover(board, destRow, destCol, opponent, diagonalMoves)) {
        return true;
    }



    return false;
}

export function isAttackedByLineMover(board: ChessSquare[][], destRow: number, destCol: number, opponent: "w" | "b", moves: { row: number, col: number }[]) {
    for (let move of moves) {
        let newRow = destRow + move.row;
        let newCol = destCol + move.col;
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (board[newRow][newCol] !== 'None') {
                if (board[newRow][newCol][0] === opponent &&
                    (board[newRow][newCol][1] === 'r' || board[newRow][newCol][1] === 'q' ||
                        board[newRow][newCol][1] === 'b')) {
                    return true;
                }
                break;
            }
            newRow += move.row;
            newCol += move.col;
        }
    }
    return false;
}

export function doesMoveCauseOwnCheck(board: ChessSquare[][], move: IMove, player: "White" | "Black") {
    const { srcRow, srcCol, destRow, destCol } = move;
    const pieceAtSource = board[srcRow][srcCol];
    const pieceAtDestination = board[destRow][destCol];
    const opponent = player === 'White' ? 'b' : 'w';

    board[destRow][destCol] = pieceAtSource;
    board[srcRow][srcCol] = 'None';

    const kingPosition = findKingPosition(board, player);
    if (!kingPosition) {
        throw new Error('King not found');
    }


    const isInCheck = isSquareAttackedByOpponent(board, kingPosition.row, kingPosition.col, opponent);

    board[srcRow][srcCol] = pieceAtSource;
    board[destRow][destCol] = pieceAtDestination;

    return isInCheck;
}

export function isCheck(board: ChessSquare[][], player: "White" | "Black"): boolean {
    const kingPosition = findKingPosition(board, player);
    if (!kingPosition) {
        throw new Error('King not found');
    }
    const opponent = player === 'White' ? 'b' : 'w';
    return isSquareAttackedByOpponent(board, kingPosition.row, kingPosition.col, opponent);
}

export function isCheckmate(board: ChessSquare[][], player: "White" | "Black"): boolean {
    if (!isCheck(board, player)) {
        return false;
    }
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece !== 'None' && piece[0] === (player === 'White' ? 'w' : 'b')) {
                for (let destRow = 0; destRow < 8; destRow++) {
                    for (let destCol = 0; destCol < 8; destCol++) {
                        const move:IMove = { srcRow: row, srcCol: col, destRow: destRow, destCol: destCol, figure: piece};
                        if (isMovePossible(board, move, player) && !doesMoveCauseOwnCheck(board, move, player)) {
                            return false; 
                        }
                    }
                }
            }
        }
    }
    return true;
}
