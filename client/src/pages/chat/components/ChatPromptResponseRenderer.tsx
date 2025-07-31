import Logo from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";
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
import EventRenderer from "./EventRenderer";

const ChatPromptResponseRenderer = ({
    sessionId,
    topMessageRef,
}: {
    sessionId?: string | null;
    topMessageRef?: React.RefObject<HTMLDivElement> | null;
}) => {
    const chatHistoryState: IChatHistoryState = useSelector(
        (state: any) => state.chatHistory
    );
    return (
        <>
            {chatHistoryState.loading && <LoadingCircle />}
            {sessionId ? (
                <div className="py-4 relative h-full flex flex-col-reverse gap-4">
                    {chatHistoryState.chatHistory[sessionId] &&
                        chatHistoryState.chatHistory[sessionId].map((ch, i) => (
                            <div key={i}>
                                <div
                                    className="flex flex-col gap-2 items-end"
                                    ref={i === 0 ? topMessageRef : null}
                                >
                                    {/* prompt */}
                                    <Card className="py-2 w-fit max-w-2xl">
                                        <CardContent className="px-4">
                                            <span>{ch.prompt}</span>
                                        </CardContent>
                                    </Card>
                                    {/* prompt options */}
                                    <div className="flex items-center justify-end gap-2">
                                        <span
                                            className="cursor-pointer"
                                            onClick={() =>
                                                copyToClipboard(ch.prompt)
                                            }
                                        >
                                            <Copy size={16} />
                                        </span>
                                        <span
                                            className="cursor-pointer"
                                            onClick={() => readAloud(ch.prompt)}
                                        >
                                            <Volume2 size={16} />
                                        </span>
                                    </div>
                                    {/* response */}
                                    <div className="w-full flex flex-col gap-4">
                                        {ch.loading ? (
                                            <>
                                                {/* response events */}
                                                {chatHistoryState.responseEvent.map(
                                                    (event, i) => (
                                                        <EventRenderer
                                                            key={i}
                                                            showLoading={
                                                                i ===
                                                                chatHistoryState
                                                                    .responseEvent
                                                                    .length -
                                                                    1
                                                            }
                                                            event={event}
                                                        />
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <ChatMetadataRenderer
                                                    metadata={ch.metadata}
                                                />
                                                <ReactMarkdown
                                                    rehypePlugins={[
                                                        rehypeHighlight,
                                                    ]}
                                                >
                                                    {ch.response}
                                                </ReactMarkdown>
                                                {/* prompt options */}
                                                <div className="flex items-center gap-2 mt-4">
                                                    <span
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                ch.response
                                                            )
                                                        }
                                                    >
                                                        <Copy size={16} />
                                                    </span>
                                                    <span
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            readAloud(
                                                                ch.response
                                                            )
                                                        }
                                                    >
                                                        <Volume2 size={16} />
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Separator
                                    className="mt-4"
                                    orientation="horizontal"
                                />
                            </div>
                        ))}
                </div>
            ) : (
                <div className="py-4 relative h-full flex flex-col gap-4">
                    <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] -z-10 opacity-60 w-full h-3/3 flex items-center justify-center">
                        <Logo size={"70px"} />
                    </div>
                    {chatHistoryState.responseEvent.map((event, i) => (
                        <EventRenderer
                            key={i}
                            showLoading={
                                i === chatHistoryState.responseEvent.length - 1
                            }
                            event={event}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default ChatPromptResponseRenderer;
