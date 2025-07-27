import ScrollToBottomBtn, {
    handleScrollToTop,
} from "@/components/ScrollToBottomBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { Separator } from "@/components/ui/separator";
import type { IChatHistoryState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getChatHistory } from "@/redux/thunks/chatThunk";
import "highlight.js/styles/github.css";
import { Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import rehypeHighlight from "rehype-highlight";
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

    if (sessionId !== null) {
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
            chatHistoryState.chatHistory[sessionId]?.length,
            sessionId,
            dispatch,
        ]);
    }

    useEffect(() => {
        handleScrollToTop();
    }, []);
    return (
        <div
            ref={contentAreaRef}
            className="grid grid-cols-1 grid-rows-[1fr_auto] gap-2 h-[calc(100dvh-110px)]"
        >
            <div className="py-4 relative h-full flex flex-col gap-4">
                {chatHistoryState.loading && <LoadingCircle />}
                {sessionId &&
                    chatHistoryState.chatHistory[sessionId] &&
                    chatHistoryState.chatHistory[sessionId].map((ch, i) => (
                        <>
                            <div
                                key={i}
                                className="flex flex-col gap-2 items-end"
                                ref={
                                    i ===
                                    chatHistoryState.chatHistory[sessionId]
                                        .length -
                                        1
                                        ? handleScrollToTop
                                        : undefined
                                }
                            >
                                <Card className="py-2 w-fit">
                                    <CardContent className="px-4">
                                        {ch.prompt}
                                    </CardContent>
                                </Card>
                                <div className="w-full">
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                        {ch.response}
                                    </ReactMarkdown>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size={"icon"}>
                                            <Copy />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Separator orientation="horizontal" />
                        </>
                    ))}
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
