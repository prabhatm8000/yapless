import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { Textarea } from "@/components/ui/textarea";
import configs from "@/constants/configs";
import { addChat } from "@/redux/reducers/chat";
import {
    addResponseEvent,
    addToChatHistory,
} from "@/redux/reducers/chatHistory";
import { type SiteMetadataType } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import type { EventDataType } from "@/types/events";
import { ArrowUp, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MdAutoMode } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";

type ModeType = "YAPLESS" | "BRIEF" | "DETAILED" | "AUTO";

const ModeDropDown = ({
    modeSelector,
    setModeSelector,
    disabled,
}: {
    modeSelector: ModeType;
    setModeSelector: (m: "YAPLESS" | "BRIEF" | "DETAILED" | "AUTO") => void;
    disabled?: boolean;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    size={"sm"}
                    className="capitalize"
                >
                    <MdAutoMode />
                    {modeSelector}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-28">
                <DropdownMenuLabel>Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "AUTO"}
                    onCheckedChange={() => setModeSelector("AUTO")}
                >
                    Auto
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "BRIEF"}
                    onCheckedChange={() => setModeSelector("BRIEF")}
                >
                    Brief
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "DETAILED"}
                    onCheckedChange={() => setModeSelector("DETAILED")}
                >
                    Detailed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={modeSelector === "YAPLESS"}
                    onCheckedChange={() => setModeSelector("YAPLESS")}
                >
                    Yapless
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const SearchButton = ({
    value,
    toggle,
    disabled,
}: {
    value: boolean;
    toggle: () => void;
    disabled?: boolean;
}) => {
    return (
        <Button
            disabled={disabled}
            size={"sm"}
            onClick={toggle}
            variant={"outline"}
            className={`${value ? "opacity-100" : "opacity-50"}`}
        >
            <Search />
            Search
        </Button>
    );
};

const Prompt = () => {
    const [modeSelector, setModeSelector] = useState<ModeType>("AUTO");
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [search, setSearch] = useState<boolean>(false);

    const propmtInputRef = useRef<HTMLTextAreaElement>(null);

    const dispatch = useDispatch<AppDispatch>();

    const [searchParams] = useSearchParams();
    const [sessionId, setSessionId] = useState<string | null>(
        searchParams.get("sessionId")
    );
    useEffect(() => {
        const sId = searchParams.get("sessionId");
        if (sId === sessionId) return;
        setSessionId(sId);
    }, [searchParams, sessionId]);

    const handleEvents = (e: EventDataType) => {
        switch (e.event) {
            case "response":
                if (e.data)
                    dispatch(
                        addToChatHistory({
                            message: e.data,
                            sessionId: e.data.sessionId,
                        })
                    );
                break;
            case "title":
                if (e.data)
                    dispatch(
                        addChat({
                            title: e.data.title,
                            sessionId: e.data.sessionId,
                            userId: e.data.userId,
                        })
                    );
                break;
        }
    };

    const sendPropmt = async (payload: {
        q: string;
        mode: ModeType;
        search: boolean;
    }) => {
        setLoading(true);
        // mock or dummy history chat insertion, till the response comes
        if (sessionId) {
            dispatch(
                addToChatHistory({
                    message: {
                        prompt: payload.q,
                        response: "",
                        sessionId,
                        metadata: new Array<SiteMetadataType>(0),
                        userId: "",
                        loading: true,
                    },
                    sessionId,
                })
            );
            setQuery("");
        }

        const base =
            configs.mode === "dev" ? configs.devBaseUrl : configs.serverBaseUrl;
        const response = await fetch(`${base}/chat`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...payload,
                sessionId: sessionId ? sessionId : undefined,
            }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        if (!reader) throw new Error("No reader");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const buffer = decoder.decode(value, { stream: true });
            // parse SSE-style chunks
            try {
                const event = JSON.parse(buffer) as EventDataType;
                dispatch(addResponseEvent(event));
                handleEvents(event);
            } catch (error: any) {
                throw new Error(error);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (loading) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                !loading &&
                propmtInputRef.current &&
                propmtInputRef.current === document.activeElement &&
                propmtInputRef.current?.value.trim() !== "" &&
                event.key === "Enter" &&
                !event.shiftKey
            ) {
                sendPropmt({
                    q: query.trim(),
                    mode: modeSelector,
                    search,
                });
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [modeSelector, search, propmtInputRef, query, dispatch, loading]);

    return (
        <Card className="py-4">
            <CardContent className="px-4">
                <Textarea
                    autoFocus
                    disabled={loading}
                    ref={propmtInputRef}
                    className="rounded-none dark:bg-transparent border-none ring-0 shadow-none p-0 w-full resize-none overflow-auto focus-visible:border-none focus-visible:ring-0 hover:outline-none active:outline-none"
                    placeholder="Ask anything, I'll not yap!, (Don't forget it's shift + enter)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        height: "auto",
                        maxHeight: "240px", // 5 lines * line-height (24px)
                    }}
                />
                <div className="mt-2 flex items-center justify-between w-full gap-2">
                    <div className="mt-2 flex items-center w-full gap-2">
                        <ModeDropDown
                            setModeSelector={setModeSelector}
                            modeSelector={modeSelector}
                            disabled={loading}
                        />
                        <SearchButton
                            value={search}
                            toggle={() => setSearch((p) => !p)}
                            disabled={loading || true}
                        />
                    </div>
                    <Button
                        disabled={loading}
                        size={"icon"}
                        className="rounded-full"
                    >
                        {loading ? (
                            <LoadingCircle className="text-background" />
                        ) : (
                            <ArrowUp />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Prompt;
