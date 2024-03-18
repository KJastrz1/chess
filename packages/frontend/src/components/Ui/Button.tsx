import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {

    return (
        <button className={`bg-gray-500 text-white hover:text-dark-4 hover:bg-primary-500  font-bold py-2 px-4 rounded ${className}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
