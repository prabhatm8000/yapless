import type { IUserState } from "@/redux/reducers/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router";
import ErrorPage, { PageDataContants } from "../ErrorPage";
import AuthLayout from "./AuthLayout";
import AuthLogin from "./views/AuthLogin";

const AuthRoutes = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (userState?.isAuthenticated) {
            navigate("/app/chat");
        }
    }, [userState?.isAuthenticated]);

    return (
        <Routes>
            <Route
                path="login"
                element={
                    <AuthLayout>
                        <AuthLogin />
                    </AuthLayout>
                }
            />
            <Route
                path="*"
                element={<ErrorPage pageData={PageDataContants.PageNotFound} />}
            />
        </Routes>
    );
};

export default AuthRoutes;
