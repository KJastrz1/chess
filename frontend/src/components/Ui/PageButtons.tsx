import React from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Input from './Input';
import Button from './Button';

interface PageButtonsProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
}

const PageButtons = ({ page, totalPages, setPage }: PageButtonsProps) => {

    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPage = parseInt(e.target.value, 10);
        if (newPage < 1) {
            setPage(1);
        } else if (newPage > totalPages) {
            setPage(totalPages);
        }
    };

    const incrementPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const decrementPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className='flex flex-row gap-2 items-center'>
            <Button onClick={decrementPage} disabled={page <= 1}>
                <FaAngleLeft />
            </Button>
            <Input
                type="number"
                value={page}
                onChange={handlePageChange}
                className="w-10"
            />
            <p>of {totalPages}</p>
            <Button onClick={incrementPage} disabled={page >= totalPages}>
                <FaAngleRight />
            </Button>
        </div>
    );
};

export default PageButtons;
