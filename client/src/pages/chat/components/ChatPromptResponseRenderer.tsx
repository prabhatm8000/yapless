import { handleScrollToTop } from "@/components/ScrollToBottomBtn";
import { Card, CardContent } from "@/components/ui/card";
import LoadingBubble from "@/components/ui/LoadingBubble";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { Separator } from "@/components/ui/separator";
import { copyToClipboard, readAloud } from "@/lib/utils";
import type { IChatHistoryState } from "@/redux/reducers/types";
import "highlight.js/styles/github.css";
import { Copy, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import rehypeHighlight from "rehype-highlight";
import ChatMetadataRenderer from "./ChatMetadataRenderer";

const ChatPromptResponseRenderer = ({ sessionId }: { sessionId: string }) => {
    const chatHistoryState: IChatHistoryState = useSelector(
        (state: any) => state.chatHistory
    );
    return (
        <div className="py-4 relative h-full flex flex-col gap-4">
            {chatHistoryState.loading && <LoadingCircle />}
            {sessionId &&
                chatHistoryState.chatHistory[sessionId] &&
                chatHistoryState.chatHistory[sessionId].map((ch, i) => (
                    <div key={i}>
                        <div
                            className="flex flex-col gap-2 items-end"
                            ref={
                                i ===
                                chatHistoryState.chatHistory[sessionId].length -
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
                            <div className="w-full flex flex-col gap-4">
                                {ch.loading ? (
                                    <LoadingBubble />
                                ) : (
                                    <>
                                        <ChatMetadataRenderer
                                            metadata={ch.metadata}
                                        />
                                        <ReactMarkdown
                                            rehypePlugins={[rehypeHighlight]}
                                        >
                                            {ch.response}
                                        </ReactMarkdown>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    copyToClipboard(ch.response)
                                                }
                                            >
                                                <Copy size={16} />
                                            </span>
                                            <span
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    readAloud(ch.response)
                                                }
                                            >
                                                <Volume2 size={16} />
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <Separator className="mt-4" orientation="horizontal" />
                    </div>
                ))}
        </div>
    );
};

export default ChatPromptResponseRenderer;
