import { Field } from 'formik';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const TextField: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <Field {...props} className={`py-2 px-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  h-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`} />
    )
}

export default TextField;
