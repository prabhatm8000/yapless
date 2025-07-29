import type {
    ApiResponseType,
    IChat,
    IChatState,
} from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getChatBySessionId } from "@/redux/thunks/chatThunk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import type { SideBarTabType } from "./components/SideBar";
import ViewHeader from "./components/ViewHeader";
import ChatView from "./views/ChatView";
import ProfileView from "./views/ProfileView";
import SettingsView from "./views/SettingsView";

const ChatPage = () => {
    const chatState: IChatState = useSelector((state: any) => state.chat);
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, _] = useSearchParams();
    const [page, setPage] = useState<{
        heading: string;
        subHeading: string;
        viewNode: React.ReactNode;
    } | null>();

    useEffect(() => {
        const fetchTheTitle = async () => {
            const tab = searchParams.get("tab") as SideBarTabType;
            const sessionId = searchParams.get("sessionId");
            switch (tab) {
                case "profile":
                    setPage({
                        heading: "Profile",
                        subHeading: "Manage your profile",
                        viewNode: <ProfileView />,
                    });
                    return;
                case "settings":
                    setPage({
                        heading: "Settings",
                        subHeading: "Manage your yapless settings",
                        viewNode: <SettingsView />,
                    });
                    return;
            }

            let chat: IChat | undefined;
            if (sessionId) {
                chat = chatState.chats.find((c) => c.sessionId === sessionId);
                if (!chat) {
                    const data = await dispatch(getChatBySessionId(sessionId));
                    const res = data.payload as ApiResponseType;
                    if (res.success) chat = res.data as IChat;
                }
            }
            setPage({
                heading: chat?.title || "New Chat",
                subHeading: "",
                viewNode: <ChatView />,
            });
        };

        fetchTheTitle();
    }, [searchParams.get("tab"), searchParams.get("sessionId")]);

    return (
        <>
            <ViewHeader
                heading={page?.heading || ""}
                subHeading={page?.subHeading}
            />
            {page?.viewNode}
        </>
    );
};

export default ChatPage;
