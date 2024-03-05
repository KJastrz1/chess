const White = {
  Pawn: "wp",
  Knight: "wn",
  Bishop: "wb",
  Rook: "wr",
  Queen: "wq",
  King: "wk",
};

const Black = {
  Pawn: "bp",
  Knight: "bn",
  Bishop: "bb",
  Rook: "br",
  Queen: "bq",
  King: "bk",
};
  
  const None = "None";
  
  const initialBoard = [
    [Black.Rook, Black.Knight, Black.Bishop, Black.Queen, Black.King, Black.Bishop, Black.Knight, Black.Rook],
    [Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn, Black.Pawn],
    [None, None, None, None, None, None, None, None],
    [None, None, None, None, None, None, None, None],
    [None, None, None, None, None, None, None, None],
    [None, None, None, None, None, None, None, None],
    [White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn, White.Pawn],
    [White.Rook, White.Knight, White.Bishop, White.Queen, White.King, White.Bishop, White.Knight, White.Rook],
  ];
  

  module.exports = { White, Black, None, initialBoard };