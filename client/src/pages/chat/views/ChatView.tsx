import Logo from "@/components/Logo";
import ScrollToBottomBtn, {
    handleScrollToTop,
} from "@/components/ScrollToBottomBtn";
import type { IChatHistoryState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getChatHistory } from "@/redux/thunks/chatThunk";
import "highlight.js/styles/github.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import ChatPromptResponseRenderer from "../components/ChatPromptResponseRenderer";
import Prompt from "../components/Prompt";

const ChatView = () => {
    const contentAreaRef = useRef<HTMLDivElement>(null);
    const [searchParams] = useSearchParams();

    const chatHistoryState: IChatHistoryState = useSelector(
        (state: any) => state.chatHistory
    );

    const [fetchMore, setFetchMore] = useState(true);
    const [sessionId, setSessionId] = useState<string | null>(
        searchParams.get("sessionId")
    );
    useEffect(() => {
        const sId = searchParams.get("sessionId");
        if (sId === sessionId) return;
        setFetchMore(true);
        setSessionId(sId);
    }, [searchParams, sessionId]);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!sessionId || !fetchMore || !chatHistoryState.hasMore) return;
        setFetchMore(false);
        dispatch(
            getChatHistory({
                sessionId,
                skip: chatHistoryState.chatHistory[sessionId]?.length || 0,
            })
        );
    }, [
        chatHistoryState.hasMore,
        chatHistoryState.chatHistory,
        sessionId,
        dispatch,
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleScrollToTop();
        }, 50);

        return () => {
            clearTimeout(timer);
        };
    }, [handleScrollToTop, sessionId, chatHistoryState.chatHistory]);
    return (
        <div
            ref={contentAreaRef}
            className="pt-[150px] md:pt-[110px] grid grid-cols-1 grid-rows-[1fr_auto] gap-2 h-dvh"
        >
            <div className="h-full">
                {sessionId ? (
                    <ChatPromptResponseRenderer sessionId={sessionId} />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <Logo size={"70px"} />
                    </div>
                )}
            </div>
            <div className="sticky bottom-0 z-10">
                <div className="absolute bottom-full right-0 z-10">
                    <ScrollToBottomBtn />
                </div>
                <div className="relative z-0">
                    <div className="absolute z-0 bottom-full left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                    <div className="py-4 bg-background">
                        <Prompt />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
