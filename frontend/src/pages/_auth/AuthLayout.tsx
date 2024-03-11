import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/Ui/Loader";

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useUserContext(); 

    if (isLoading) {
        console.log('loading user');
        return <Loader />;
    }

    console.log("is auth", isAuthenticated)

    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/" />
            ) : (
                <section className="flex flex-1 justify-center items-center flex-col py-10">
                    <Outlet />
                </section>
            )}
        </>
    );
}
