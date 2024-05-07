import { Black, ChessSquare, IMove, SelectedPiece, White } from "@/types/index"

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

  const moves = [];

  const isWhite = Object.values(White).includes(figure as White);

  const pawnDirection = isWhite ? -1 : 1;
  const opponentPieces = isWhite ? Black : White;

  switch (figure) {
    case White.Pawn:
    case Black.Pawn:
      if (gameState[row + pawnDirection]?.[col] === "None") {
        const move: IMove = { srcRow: row, srcCol: col, destRow: row + pawnDirection, destCol: col, figure: figure };
        if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
          moves.push({ row: row + pawnDirection, col: col });
        }
        if ((isWhite && row === 6) || (!isWhite && row === 1) && gameState[row + 2 * pawnDirection]?.[col] === "None") {
          const move: IMove = { srcRow: row, srcCol: col, destRow: row + 2 * pawnDirection, destCol: col, figure: figure };
          if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
            moves.push({ row: row + 2 * pawnDirection, col: col });
          }
        }
      }

      [col - 1, col + 1].forEach(newCol => {
        if (newCol >= 0 && newCol < 8 && gameState[row + pawnDirection]?.[newCol] !== "None" && Object.values(opponentPieces).includes(gameState[row + pawnDirection][newCol])) {
          const move: IMove = { srcRow: row, srcCol: col, destRow: row + pawnDirection, destCol: newCol, figure: figure };
          if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
            moves.push({ row: row + pawnDirection, col: newCol });
          }
        }
      });
      break;

    case White.Knight:
    case Black.Knight:
      knightMoves.forEach(({ row: newRow, col: newCol }) => {
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && (gameState[newRow][newCol] === "None" || Object.values(opponentPieces).includes(gameState[newRow][newCol]))) {
          const move: IMove = { srcRow: row, srcCol: col, destRow: newRow, destCol: newCol, figure: figure };
          if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
            moves.push({ row: newRow, col: newCol });
          }
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
          if (Object.values(opponentPieces).includes(target) || target === "None") {
            const move: IMove = { srcRow: row, srcCol: col, destRow: newRow, destCol: newCol, figure: figure };
            if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
              moves.push({ row: newRow, col: newCol });
            }
          }
          break;

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
            const move: IMove = { srcRow: row, srcCol: col, destRow: newRow, destCol: newCol, figure: figure };
            if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
              moves.push({ row: newRow, col: newCol });
            }
          } else {
            if (Object.values(opponentPieces).includes(target)) {
              const move: IMove = { srcRow: row, srcCol: col, destRow: newRow, destCol: newCol, figure: figure };
              if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
                moves.push({ row: newRow, col: newCol });
              }
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
            const move: IMove = { srcRow: row, srcCol: col, destRow: newRow, destCol: newCol, figure: figure };
            if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
              moves.push({ row: newRow, col: newCol });
            }
          } else {
            if (Object.values(opponentPieces).includes(target)) {
              const move: IMove = { srcRow: row, srcCol: col, destRow: newRow, destCol: newCol, figure: figure };
              if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
                moves.push({ row: newRow, col: newCol });
              }
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

        const newRow = row + dRow;
        const newCol = col + dCol;

        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return;

        const target = gameState[newRow][newCol];
        if (target === "None" || Object.values(opponentPieces).includes(target)) {
          const move: IMove = { srcRow: row, srcCol: col, destRow: newRow, destCol: newCol, figure: figure };

          if (!doesMoveCauseOwnCheck(gameState, move, isWhite ? "White" : "Black")) {
            moves.push({ row: newRow, col: newCol });
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

export const checkCapture = (possibleMoves: { row: number, col: number }[], selectedPiece: SelectedPiece | null, destRow: number, destCol: number, gameState: ChessSquare[][]): boolean => {
  if (!selectedPiece) return false;
  if (!checkIfPossibleMove(possibleMoves, destRow, destCol)) return false;
  const target = gameState[destRow][destCol];
  return target !== "None" && (Object.values(White).includes(selectedPiece.figure as White) && Object.values(Black).includes(target as Black) || Object.values(Black).includes(selectedPiece.figure as Black) && Object.values(White).includes(target as White));
};

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
  for (const move of knightMoves) {
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
  for (const move of moves) {
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


