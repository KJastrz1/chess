import { ChessSquare } from "@chess/types";

export function isMovePossible(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, player: "White" | "Black") {
    const piece = board[srcRow][srcCol];
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
            isPossible = isPawnMovePossible(board, srcRow, srcCol, destRow, destCol, direction, startRow, opponent);
            break;
        case 'n':
            isPossible = isKnightMovePossible(board, srcRow, srcCol, destRow, destCol, opponent);
            break;
        case 'b':
            isPossible = isBishopMovePossible(board, srcRow, srcCol, destRow, destCol, opponent);
            break;
        case 'r':
            isPossible = isRookMovePossible(board, srcRow, srcCol, destRow, destCol, opponent);
            break;
        case 'q':
            isPossible = isQueenMovePossible(board, srcRow, srcCol, destRow, destCol, opponent);
            break;
        case 'k':
            isPossible = isKingMovePossible(board, srcRow, srcCol, destRow, destCol, opponent);
            break;
        default:
            isPossible = false;
    }
    return isPossible && !doesMoveCauseOwnCheck(board, srcRow, srcCol, destRow, destCol, player);
}

export function isPawnMovePossible(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, direction: number, startRow: number, opponent: "w" | "b") {

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

export function isKnightMovePossible(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, opponent: "w" | "b") {
    const rowDiff = Math.abs(srcRow - destRow);
    const colDiff = Math.abs(srcCol - destCol);


    const isValidMove = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    if (!isValidMove) {
        return false;
    }


    const targetPiece = board[destRow][destCol];
    if (targetPiece === 'None' || targetPiece[0] === opponent) {
        return true;
    }

    return false;
}

export function isBishopMovePossible(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, opponent: "w" | "b") {
    if (Math.abs(destRow - srcRow) !== Math.abs(destCol - srcCol)) {
        return false;
    }

    const rowDirection = destRow > srcRow ? 1 : -1;
    const colDirection = destCol > srcCol ? 1 : -1;

    let currentRow = srcRow + rowDirection;
    let currentCol = srcCol + colDirection;


    while (currentRow !== destRow && currentCol !== destCol) {
        if (board[currentRow][currentCol] !== 'None') {
            return false;
        }
        currentRow += rowDirection;
        currentCol += colDirection;
    }

    const destinationPiece = board[destRow][destCol];
    if (destinationPiece !== 'None' && destinationPiece[0] !== opponent) {
        return false;
    }
    return true;
}

export function isRookMovePossible(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, opponent: "w" | "b") {
    if (srcRow !== destRow && srcCol !== destCol) {
        return false;
    }

    const rowDirection = destRow > srcRow ? 1 : (destRow < srcRow ? -1 : 0);
    const colDirection = destCol > srcCol ? 1 : (destCol < srcCol ? -1 : 0);

    let currentRow = srcRow + rowDirection;
    let currentCol = srcCol + colDirection;


    while (currentRow !== destRow || currentCol !== destCol) {
        if (board[currentRow][currentCol] !== 'None') {
            return false;
        }
        currentRow += rowDirection;
        currentCol += colDirection;
    }

    const destinationPiece = board[destRow][destCol];
    if (destinationPiece !== 'None' && destinationPiece[0] !== opponent[0]) {
        return false;
    }

    return true;
}

export function isQueenMovePossible(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, opponent: "w" | "b") {
    const isDiagonalMove = Math.abs(destRow - srcRow) === Math.abs(destCol - srcCol);
    const isStraightMove = srcRow === destRow || srcCol === destCol;

    if (!isDiagonalMove && !isStraightMove) {
        return false;
    }


    const rowDirection = destRow > srcRow ? 1 : (destRow < srcRow ? -1 : 0);
    const colDirection = destCol > srcCol ? 1 : (destCol < srcCol ? -1 : 0);

    let currentRow = srcRow + rowDirection;
    let currentCol = srcCol + colDirection;


    while (currentRow !== destRow || currentCol !== destCol) {
        if (board[currentRow][currentCol] !== 'None') {
            return false;
        }
        currentRow += rowDirection;
        currentCol += colDirection;
        if (currentRow === destRow && currentCol === destCol) break;
    }


    const destinationPiece = board[destRow][destCol];
    if (destinationPiece !== 'None' && destinationPiece[0] === opponent[0]) {
        return false;
    }

    return true;
}

export function isKingMovePossible(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, opponent: "w" | "b") {

    if (Math.abs(srcRow - destRow) > 1 || Math.abs(srcCol - destCol) > 1) {
        return false;
    }

    const destinationPiece = board[destRow][destCol];
    if (destinationPiece !== 'None' && destinationPiece[0] === opponent[0]) {
        return false;
    }

    if (isSquareAttackedByOpponent(destRow, destCol, board, opponent)) {
        return false;
    }

    return true;
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
                        board[newRow][newCol][1] === 'b' && moves === diagonalMoves)) {
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

export function doesMoveCauseOwnCheck(board: ChessSquare[][], srcRow: number, srcCol: number, destRow: number, destCol: number, player: "White" | "Black") {
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

