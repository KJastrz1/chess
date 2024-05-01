import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    customClassName?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
    const noSpinnersClass = props.type === 'number' ? 'no-spinners' : '';

    const classNames = `px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className} ${noSpinnersClass}`;

    return (
        <>
            <style>{`
                .no-spinners::-webkit-inner-spin-button,
                .no-spinners::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .no-spinners {
                    -moz-appearance: textfield;
                }
            `}</style>
            <input
                className={classNames}
                {...props}
            />
        </>
    );
}

export default Input;
