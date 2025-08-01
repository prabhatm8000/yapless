import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import SuspenseWrapper from "./components/SuspenseWrapper";
import useTheme from "./hooks/useTheme";
import ErrorPage, { PageDataContants } from "./pages/ErrorPage";
import LandingPage from "./pages/landing/LandingPage";
import LoadingPage from "./pages/LoadingPage";
import type { IUserState } from "./redux/reducers/types";
import type { AppDispatch } from "./redux/store";
import { verifyUser } from "./redux/thunks/userThunk";

const AuthRoutes = lazy(() => import("./pages/auth/AuthRoutes"));
const ChatRoutes = lazy(() => import("./pages/chat/ChatRoutes"));
const LegalRoutes = lazy(() => import("./pages/legal/LegalRoutes"));

const PrivateRoutes = ({ user }: { user: IUserState }) => {
    const navigate = useNavigate();
    if (!user.isAuthenticated) {
        toast.error("You are not logged in.", {
            description: "Redirecting to login page.",
            onAutoClose: () => navigate("/auth/login"),
            position: "top-center",
            duration: 5000,
        });
        return <LoadingPage />;
    }
    return (
        <Routes>
            <Route
                path="/chat"
                element={
                    <SuspenseWrapper>
                        <ChatRoutes />
                    </SuspenseWrapper>
                }
            />
            <Route
                path="*"
                element={
                    <SuspenseWrapper>
                        <ErrorPage pageData={PageDataContants.PageNotFound} />
                    </SuspenseWrapper>
                }
            />
        </Routes>
    );
};

const AppRouter = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const { theme } = useTheme();

    useEffect(() => {
        dispatch(verifyUser());
    }, []);
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <SuspenseWrapper>
                            <LandingPage />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="/auth/*"
                    element={
                        <SuspenseWrapper>
                            <AuthRoutes />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="/legal/*"
                    element={
                        <SuspenseWrapper>
                            <LegalRoutes />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="/app/*"
                    element={
                        user.loading ? (
                            <LoadingPage />
                        ) : (
                            <PrivateRoutes user={user} />
                        )
                    }
                />
            </Routes>
            <Toaster
                theme={theme}
                richColors
                duration={5 * 1000}
                swipeDirections={["bottom", "left", "right", "top"]}
                closeButton
                position="top-right"
            />
        </BrowserRouter>
    );
};

export default AppRouter;
