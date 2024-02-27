const White = {
    Pawn: "White_Pawn",
    Knight: "White_Knight",
    Bishop: "White_Bishop",
    Rook: "White_Rook",
    Queen: "White_Queen",
    King: "White_King",
  };
  
  const Black = {
    Pawn: "Black_Pawn",
    Knight: "Black_Knight",
    Bishop: "Black_Bishop",
    Rook: "Black_Rook",
    Queen: "Black_Queen",
    King: "Black_King",
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