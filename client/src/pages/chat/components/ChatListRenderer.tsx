import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { clearStateExceptChatHistory } from "@/redux/reducers/chatHistory";
import type { IChat, IChatState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { deleteChatBySessionId, getChats } from "@/redux/thunks/chatThunk";
import { Ellipsis, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

const OptionRenderer = ({ sessionId }: { sessionId: string }) => {
    const chatState: IChatState = useSelector((state: any) => state.chat);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const handleDelete = () => {
        if (!sessionId && chatState.loading) return;
        dispatch(deleteChatBySessionId(sessionId)).then(() => {
            navigate("/app/chat");
        });
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={"icon"}
                    className="focus-visible:ring-0"
                >
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-28">
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDelete()}
                >
                    <Trash />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const ChatListRenderer = ({
    setShowSideBar,
}: {
    setShowSideBar: () => void;
}) => {
    const chatState: IChatState = useSelector((state: any) => state.chat);
    const dispatch = useDispatch<AppDispatch>();
    const [fetchMore, setFetchMore] = useState<boolean>(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentChat, setCurrentChat] = useState<string | null>(
        searchParams.get("sessionId")
    );

    const handleChatClick = (ch: IChat) => {
        if (ch.sessionId === currentChat) return;
        setSearchParams((prev) => {
            prev.set("tab", "chat");
            prev.set("sessionId", ch.sessionId);
            return prev;
        });
        setShowSideBar();
        dispatch(clearStateExceptChatHistory()); // clear othere states like, hasMore, loading...
    };

    useEffect(() => {
        let sessionId = searchParams.get("sessionId");
        setCurrentChat(sessionId);
    }, [searchParams.get("sessionId")]);

    // chats
    useEffect(() => {
        if (!fetchMore || chatState.loading || !chatState.hasMore) return;
        setFetchMore(false); // prevent infinite loop
        dispatch(
            getChats({
                skip: chatState.chats.length,
                limit: 20,
            })
        );
    }, [
        fetchMore,
        chatState.chats.length,
        chatState.hasMore,
        chatState.loading,
        dispatch,
    ]);
    return (
        <div
            className="flex flex-col max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden"
            style={{
                scrollbarWidth: "none",
            }}
        >
            {chatState.chats.map((ch, index) => (
                <div
                    className="flex w-full items-center"
                    onMouseEnter={(e) => {
                        const btnElement = e.currentTarget
                            .children[0] as HTMLElement;
                        btnElement.classList.remove("w-full");
                        btnElement.classList.add("w-48");
                    }}
                    onMouseLeave={(e) => {
                        const btnElement = e.currentTarget
                            .children[0] as HTMLElement;
                        btnElement.classList.remove("w-48");
                        btnElement.classList.add("w-full");
                    }}
                >
                    <Button
                        key={index}
                        onClick={() => handleChatClick(ch)}
                        variant="ghost"
                        className={`flex justify-start px-1.5 py-0 w-full ${
                            currentChat === ch.sessionId
                                ? "bg-muted-foreground/10 text-foreground"
                                : ""
                        }`}
                    >
                        <span className="truncate">{ch.title}</span>
                    </Button>
                    <OptionRenderer sessionId={ch.sessionId} />
                </div>
            ))}
            {chatState.hasMore && (
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    disabled={chatState.loading}
                    onClick={() => setFetchMore(true)}
                >
                    {chatState.loading ? (
                        <LoadingCircle className="mx-auto size-5" />
                    ) : (
                        "More"
                    )}
                </Button>
            )}
        </div>
    );
};

export default ChatListRenderer;
