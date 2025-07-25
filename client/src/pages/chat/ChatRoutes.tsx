import { Route, Routes } from "react-router";
import ErrorPage, { PageDataContants } from "../ErrorPage";
import ChatLayout from "./ChatLayout";
import ChatPage from "./ChatPage";

const ChatRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ChatLayout>
                        <ChatPage />
                    </ChatLayout>
                }
            />
            <Route
                path="*"
                element={<ErrorPage pageData={PageDataContants.PageNotFound} />}
            />
        </Routes>
    );
};

export default ChatRoutes;
