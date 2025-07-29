import ScrollToBottomBtn, {
    handleScrollToBottom,
} from "@/components/ScrollToBottomBtn";
import type { IChatHistoryState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getChatHistory } from "@/redux/thunks/chatThunk";
import "highlight.js/styles/github.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import ChatPromptResponseRenderer from "../components/ChatPromptResponseRenderer";
import ChatTitleRenderer from "../components/ChatTitleRenderer";
import Prompt from "../components/Prompt";

const ChatView = () => {
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
    }, [searchParams.get("sessionId"), sessionId]);

    const dispatch = useDispatch<AppDispatch>();

    const len =
        (sessionId ? chatHistoryState.chatHistory[sessionId] : [])?.length || 0;
    useEffect(() => {
        if (
            !sessionId ||
            !fetchMore ||
            chatHistoryState.loading ||
            !chatHistoryState.hasMore
        )
            return;
        setFetchMore(false);
        dispatch(
            getChatHistory({
                sessionId,
                skip: len,
            })
        ).then(() => {
            if (len === 0) handleScrollToBottom("instant"); // initial scroll
        });
    }, [
        sessionId,
        fetchMore,
        chatHistoryState.loading,
        chatHistoryState.hasMore,
        len,
        dispatch,
    ]);

    useEffect(() => {
        const container = document.getElementById("main-screen");
        if (!container) return;
        const handleScroll = () => {
            if (
                container.scrollTop <= 500 &&
                len > 0 &&
                !fetchMore &&
                !chatHistoryState.loading
            ) {
                setFetchMore(true);
            }
        };
        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [len, fetchMore, chatHistoryState.loading]);

    useEffect(() => {
        if (!sessionId) return;
        const timer = setTimeout(() => {
            handleScrollToBottom();
        }, 50);

        return () => {
            clearTimeout(timer);
        };
    }, [handleScrollToBottom, sessionId, chatHistoryState.responseEvent]);
    return (
        <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 h-dvh">
            <div className="fixed w-4xl top-0 z-10">
                <ChatTitleRenderer sessionId={sessionId} />
            </div>
            <div className="h-[100px]" />
            {/* dummy div to handle grid, cause 1'st div is not working in sticky, 
            /** as fixed it, and to handle rest properly add this */}
            <div className="h-full">
                <ChatPromptResponseRenderer
                    sessionId={sessionId}
                    topMessageRef={null}
                />
            </div>
            <div className="sticky bottom-0 z-10">
                <div className="absolute bottom-full right-0 m-2 z-10">
                    <ScrollToBottomBtn />
                </div>
                <div className="relative z-0">
                    <div className="absolute z-0 bottom-full left-0 right-0 h-14 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                    <div className="pb-4 bg-background">
                        <Prompt />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
