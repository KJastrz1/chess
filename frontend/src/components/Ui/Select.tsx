import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

const Select: React.FC<InputProps> = ({ children, ...props }) => {
    const classNames = `px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className}`;
    return (
        <input type="select" className={classNames} {...props}>
            {children}
        </input>
    );
}

export default Select;
