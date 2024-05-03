import React, { createContext, useState, useEffect, useContext } from 'react';
import { IUser } from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '@/lib/api';

export const initialUser = {
    _id: '',
    username: '',
    email: ''
};

const INITIAL_STATE = {
    user: initialUser,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    isLoading: false
};

type IContextType = {
    user: IUser;
    login: (userData: IUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(initialUser);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthUser = async () => {    
        console.log("checking auth user")

        try {
            const data = await getCurrentUser();
            if (data) {
                login(data);
                return true;
            }
            navigate("/login");
            return false;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthUser();
    }, []);


    const login = (userData: IUser) => {
        setUser(userData);
        setIsAuthenticated(true);
        navigate('/');
    };


    const logout = async () => {
        await logoutUser();
        setUser(initialUser);
        setIsAuthenticated(false);
        navigate('/login');
    };


    const value = {
        user,
        login,
        logout,
        isAuthenticated,
        isLoading
    };
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    );

}

export const useUserContext = () => {
    return useContext(AuthContext);
}