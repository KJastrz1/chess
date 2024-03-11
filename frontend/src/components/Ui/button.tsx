import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  
    const classNames = `bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ${className}`;
    return (
       <button className={classNames} {...props}>
           {children}
       </button>
    );
}

export default Button;
