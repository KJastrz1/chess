import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/Ui/Loader";
import ThemeSwitch from "@/shared/ThemeSwitch";

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useUserContext();

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/" />
            ) : (
                <>
                    <div className='p-4 self-end'>
                        <ThemeSwitch />
                    </div>

                    <section className="flex flex-1 justify-center items-center flex-col py-10">
                        <Outlet />
                    </section>
                </>
            )}
        </>
    );
}
