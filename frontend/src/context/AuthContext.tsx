import React, { createContext,  useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { IUser } from '../types/types';
import { useNavigate } from 'react-router-dom';

export const initialUser = {
    id: ''
};

const INITIAL_STATE = {
    user: initialUser,
    login: () => { },
    logout: () => { }
};

type IContextType = {
    user: IUser;
    login: (userData: IUser) => void;
    logout: () => void;
};

export const AuthContext = createContext<IContextType>(INITIAL_STATE);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(initialUser);

    useEffect(() => {
        const user = Cookies.get('user');
        if (user) {
            setUser(JSON.parse(user));
        } else {
            navigate('/');
        }
    }, []);

    const login = (userData: IUser) => {
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    };


    const logout = () => {
        setUser({ id: '' });
        Cookies.remove('user');
        navigate('/');
    };


    const value = {
        user,
        login,
        logout
    };
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    );

}

