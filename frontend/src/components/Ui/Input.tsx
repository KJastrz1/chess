import React, { InputHTMLAttributes, ReactNode } from 'react';


interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: ReactNode; 
}

const Input: React.FC<CustomInputProps> = ({ children, ...props }) => {
    return (
        <div className="input-wrapper">
            <input
                {...props} 
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className || ''}`}
            />
            {children}
        </div>
    );
};
export default Input; 