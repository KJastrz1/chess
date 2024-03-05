import { White, Black, ChessSquare, SelectedPiece } from "../consts/chessPieces";




export const calculatePossibleMoves = (figure: White | Black, row: number, col: number, gameState: (ChessSquare)[][]) => {

    const knightMoves = [
        { row: row - 2, col: col + 1 }, { row: row - 2, col: col - 1 },
        { row: row + 2, col: col + 1 }, { row: row + 2, col: col - 1 },
        { row: row - 1, col: col + 2 }, { row: row + 1, col: col + 2 },
        { row: row - 1, col: col - 2 }, { row: row + 1, col: col - 2 },
    ];

    const lineMoves = [
        { dRow: -1, dCol: 0 }, { dRow: 1, dCol: 0 },
        { dRow: 0, dCol: -1 }, { dRow: 0, dCol: 1 },
    ];

    const diagonalMoves = [
        { dRow: -1, dCol: -1 }, { dRow: -1, dCol: 1 },
        { dRow: 1, dCol: -1 }, { dRow: 1, dCol: 1 },
    ];

    let moves = [];

    const isWhite = Object.values(White).includes(figure);

    const pawnDirection = isWhite ? -1 : 1;
    const opponentPieces = isWhite ? Black : White;

    switch (figure) {
        case White.Pawn:
        case Black.Pawn:
            if (gameState[row + pawnDirection]?.[col] === "None") {
                moves.push({ row: row + pawnDirection, col: col });
                if ((isWhite && row === 6) || (!isWhite && row === 1) && gameState[row + 2 * pawnDirection]?.[col] === "None") {
                    moves.push({ row: row + 2 * pawnDirection, col: col });
                }
            }

            [col - 1, col + 1].forEach(newCol => {
                if (newCol >= 0 && newCol < 8 && gameState[row + pawnDirection]?.[newCol] !== "None" && Object.values(opponentPieces).includes(gameState[row + pawnDirection][newCol])) {
                    moves.push({ row: row + pawnDirection, col: newCol });
                }
            });
            break;

        case White.Knight:
        case Black.Knight:
            knightMoves.forEach(({ row: newRow, col: newCol }) => {
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && (gameState[newRow][newCol] === "None" || Object.values(opponentPieces).includes(gameState[newRow][newCol]))) {
                    moves.push({ row: newRow, col: newCol });
                }
            });
            break;

        case White.Bishop:
        case Black.Bishop:
            diagonalMoves.forEach(({ dRow, dCol }) => {
                for (let i = 1; i < 8; i++) {
                    const newRow = row + dRow * i;
                    const newCol = col + dCol * i;

                    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

                    const target = gameState[newRow][newCol];
                    if (target === "None") {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        if (Object.values(opponentPieces).includes(target)) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            });
            break;

        case White.Rook:
        case Black.Rook:
            lineMoves.forEach(({ dRow, dCol }) => {
                for (let i = 1; i < 8; i++) {
                    const newRow = row + dRow * i;
                    const newCol = col + dCol * i;

                    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

                    const target = gameState[newRow][newCol];
                    if (target === "None") {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        if (Object.values(opponentPieces).includes(target)) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            });
            break;

        case White.Queen:
        case Black.Queen: {
            const queenMoves = [...lineMoves, ...diagonalMoves];
            queenMoves.forEach(({ dRow, dCol }) => {
                for (let i = 1; i < 8; i++) {
                    const newRow = row + dRow * i;
                    const newCol = col + dCol * i;

                    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

                    const target = gameState[newRow][newCol];
                    if (target === "None") {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        if (Object.values(opponentPieces).includes(target)) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            });
            break;
        }
        case White.King:
        case Black.King: {
            const kingMoves = [...lineMoves, ...diagonalMoves];
            kingMoves.forEach(({ dRow, dCol }) => {
                for (let i = 1; i < 1; i++) {
                    const newRow = row + dRow * i;
                    const newCol = col + dCol * i;

                    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

                    const target = gameState[newRow][newCol];
                    if (target === "None") {
                        moves.push({ row: newRow, col: newCol });
                    } else {
                        if (Object.values(opponentPieces).includes(target)) {
                            moves.push({ row: newRow, col: newCol });
                        }
                        break;
                    }
                }
            });
        }
            break;
    }

    return moves;
}

export const checkIfPossibleMove = (possibleMoves: { row: number, col: number }[], row: number, col: number): boolean => {
    return possibleMoves.some(move => move.row === row && move.col === col);
};

export const checkCapture = (selectedPiece: SelectedPiece | null, row: number, col: number, gameState: ChessSquare[][]): boolean => {
    if (!selectedPiece) return false;
    const target = gameState[row][col];
    return target !== "None" && (Object.values(White).includes(selectedPiece.figure) && Object.values(Black).includes(target) || Object.values(Black).includes(selectedPiece.figure) && Object.values(White).includes(target));
};
