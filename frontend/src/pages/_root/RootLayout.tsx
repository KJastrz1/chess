import React from 'react';
import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import Loader from '@/components/Ui/Loader';
import TopBar from '@/shared/TopBar';

const RootLayout = () => {
    const { isAuthenticated, isLoading } = useUserContext();

    if (isLoading) {
        console.log('loading user');
        return <Loader />;
    }


    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }


    return (
        <div className="w-full">
            <TopBar />

            <Outlet />

        </div>
    );
};

export default RootLayout;
