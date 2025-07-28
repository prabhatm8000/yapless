import Logo from "@/components/Logo";
import TitleText from "@/components/TitleText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { Separator } from "@/components/ui/separator";
import { clearStateExceptChatHistory } from "@/redux/reducers/chatHistory";
import type { AppDispatch } from "@/redux/store";
import { getChats } from "@/redux/thunks/chatThunk";
import { Plus } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { IoIosClose, IoIosSettings } from "react-icons/io";
import { TbMenu } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router";
import { Button } from "../../../components/ui/button";
import type {
    IChat,
    IChatState,
    IUserState,
} from "../../../redux/reducers/types";

// #region SideBar
const SideBar = ({
    setShowSideBar,
    className,
}: {
    setShowSideBar: () => void;
    className?: string;
}) => {
    return (
        <div
            className={`w-60 h-full backdrop-blur-lg bg-background py-4 flex flex-col justify-between border-r border-r-border ${className}`}
        >
            <div className="flex flex-col gap-6 relative">
                <SideBarHeader />
                <SideBarBody setShowSideBar={setShowSideBar} />
            </div>
            <SideBarFooter setShowSideBar={setShowSideBar} />
        </div>
    );
};

export default SideBar;
// #endregion SideBar

// #region Header
export const SideBarHeader = () => {
    return (
        <div className="flex items-center justify-between gap-2 px-4">
            <Link to={"/"}>
                <TitleText className="text-xl flex gap-2 justify-start items-center">
                    <Logo />
                    <span>Yapless</span>
                </TitleText>
            </Link>
        </div>
    );
};
// #endregion Header

// #region Body
export type SideBarTabType = "profile" | "settings" | "chat";
const tabs: { title: string; value: SideBarTabType; icon: JSX.Element }[] = [
    { title: "Settings", value: "settings", icon: <IoIosSettings /> },
];
const SideBarBody = ({ setShowSideBar }: { setShowSideBar: () => void }) => {
    const chatState: IChatState = useSelector((state: any) => state.chat);
    const dispatch = useDispatch<AppDispatch>();
    const [fetchMore, setFetchMore] = useState<boolean>(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState<SideBarTabType>(
        searchParams.get("tab") as SideBarTabType
    );
    const [currentChat, setCurrentChat] = useState<string | null>(
        searchParams.get("sessionId")
    );
    const handleTabChange = (tab: SideBarTabType) => {
        setSearchParams((prev) => {
            prev.set("tab", tab);
            return prev;
        });
        setShowSideBar();
    };

    const handleNewChatClick = () => {
        setSearchParams((prev) => {
            prev.set("tab", "chat");
            prev.delete("sessionId");
            return prev;
        });
        setShowSideBar();
        dispatch(clearStateExceptChatHistory()); // clear othere states like, hasMore, loading...
    };

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

    // seting tab
    useEffect(() => {
        let tab = (searchParams.get("tab") as SideBarTabType) || "links";
        setCurrentTab(tab);
    }, [searchParams]);

    useEffect(() => {
        let sessionId = searchParams.get("sessionId");
        setCurrentChat(sessionId);
    });

    // chats
    useEffect(() => {
        if (!fetchMore || chatState.loading || !chatState.hasMore) return;
        setFetchMore(false); // prevent infinite loop
        dispatch(
            getChats({
                skip: chatState.chats.length,
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
        <div className="flex flex-col gap-6 px-1">
            <div className="flex flex-col text-muted-foreground font-semibold text-sm">
                <Button
                    className={`relative flex items-center justify-start gap-1 px-0 py-1.5 h-fit`}
                    variant={"ghost"}
                    onClick={handleNewChatClick}
                >
                    <Plus />
                    <span>New Chat</span>
                </Button>
                {tabs.map((tab, index) => (
                    <Button
                        key={index}
                        onClick={() => handleTabChange(tab.value)}
                        variant="ghost"
                        className={`relative flex items-center justify-start gap-1 px-2 py-1.5 h-fit ${
                            currentTab === tab.value
                                ? "bg-muted-foreground/15 text-foreground"
                                : ""
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.title}</span>
                    </Button>
                ))}
                <Separator orientation="horizontal" className="my-2" />
                <span className="text-foreground font-semibold text-sm px-2">
                    Chats
                </span>
                {chatState.chats.map((ch, index) => (
                    <Button
                        key={index}
                        onClick={() => handleChatClick(ch)}
                        variant="ghost"
                        className={`relative flex items-center justify-start gap-1 px-2 py-1.5 h-fit ${
                            currentChat === ch.sessionId
                                ? "bg-muted-foreground/15 text-foreground"
                                : ""
                        }`}
                    >
                        <span className="truncate">{ch.title}</span>
                    </Button>
                ))}
                {chatState.loading && <LoadingCircle />}
                {chatState.hasMore && (
                    <Button
                        size={"sm"}
                        variant={"ghost"}
                        onClick={() => setFetchMore(true)}
                    >
                        More
                    </Button>
                )}
            </div>
        </div>
    );
};
// #endregion Body

// #region Footer
export const SideBarFooter = ({
    setShowSideBar,
}: {
    setShowSideBar: () => void;
}) => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const [_, setSearchParams] = useSearchParams();
    const handleTabChange = (tab: SideBarTabType) => {
        setSearchParams((p) => {
            p.set("tab", tab);
            return p;
        });
        setShowSideBar();
    };
    return (
        <div className="flex items-center justify-between gap-4 absolute bottom-0 my-6 px-4">
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleTabChange("profile")}
            >
                <Avatar>
                    <AvatarImage
                        src={userState?.user?.profilePicture}
                        alt={userState?.user?.name}
                    />
                    <AvatarFallback>
                        {userState?.user?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                        {userState.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {userState.user?.email}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const SideBarBtn = ({
    showSideBar,
    onClick,
}: {
    showSideBar: boolean;
    onClick: () => void;
}) => {
    return (
        <Button
            variant={"outline"}
            className="fixed top-0 right-0 m-6 md:hidden transition-all duration-300 ease-out z-50"
            onClick={onClick}
            size={"icon"}
        >
            <div
                className={`transform ${
                    showSideBar ? "rotate-0" : "rotate-360"
                } transition-all duration-500 ease-in-out`}
            >
                {showSideBar ? (
                    <IoIosClose className="size-8" />
                ) : (
                    <TbMenu className="size-5" />
                )}
            </div>
        </Button>
    );
};
