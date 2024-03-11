import React from 'react';
import { ChessSquare } from '../enums/chessPieces';

interface SquareProps {
    isWhite?: boolean;
    figure: ChessSquare;
    onClick?: (figure: ChessSquare, row: number, col: number) => void;
    highlight?: boolean;
    row: number;
    col: number;
    capture?: boolean;
}

const Square = ({ onClick, isWhite = false, figure, highlight, row, col, capture }: SquareProps) => {
    const imagePath = figure !== "None" ? `/assets/figures/${figure}.svg` : '';

    const handleClick = () => onClick?.(figure, row, col);

    return (
        <div className={`flex justify-center items-center ${isWhite ? 'bg-slate-200' : 'bg-gray-500'} relative`}>
            <button onClick={handleClick} className="flex justify-center items-center w-full h-full">
                {capture && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-full"></div>
                )}
                {highlight && !capture && (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <div className="bg-green-400 bg-opacity-80 rounded-full w-10 h-10"></div>
                    </div>
                )}
                {figure !== "None" ? (
                    <img src={imagePath} alt={figure} className='w-14 h-14 sm:w-20 sm:h-20' />
                ) : (
                    <div className="w-14 h-14 sm:w-20 sm:h-20 opacity-0">Empty</div>
                )}
            </button>
        </div>
    );
};


export default Square;