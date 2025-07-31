import TitleText from "@/components/TitleText";
import type {
    ApiResponseType,
    IChat,
    IChatState,
} from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getChatBySessionId } from "@/redux/thunks/chatThunk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatTitleRenderer = ({ sessionId }: { sessionId?: string | null }) => {
    const chatState: IChatState = useSelector((state: any) => state.chat);
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState<string>();

    useEffect(() => {
        setTitle(undefined);
    }, [sessionId]);

    useEffect(() => {
        const fetchTheTitle = async () => {
            if (sessionId) {
                let chat = chatState.chats.find(
                    (c) => c.sessionId === sessionId
                );
                if (!chat) {
                    const data = await dispatch(getChatBySessionId(sessionId));
                    const res = data.payload as ApiResponseType;
                    if (res.success) chat = res.data as IChat;
                }
                setTitle(chat?.title);
            } else {
                setTitle("New Chat");
            }
        };

        if (!title && !chatState.loading) fetchTheTitle();
    }, [title, chatState.chats, chatState.loading, dispatch]);

    return (
        <div className="relative">
            {/* Top fade effect */}
            <div className="absolute top-full left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            <div className="pt-4 bg-background">
                <TitleText className="text-3xl font-light w-[calc(56rem-50px)] pb-2 truncate">
                    {title || "New Chat"}
                </TitleText>
            </div>
        </div>
    );
};

export default ChatTitleRenderer;
