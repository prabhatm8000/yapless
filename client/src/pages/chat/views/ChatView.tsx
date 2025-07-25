import ScrollToBottomBtn, {
    handleScrollToTop,
} from "@/components/ScrollToBottomBtn";
import { useEffect, useRef } from "react";
import Prompt from "../components/Prompt";

const ChatView = () => {
    const contentAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        handleScrollToTop();
    }, []);
    return (
        <div
            ref={contentAreaRef}
            className="grid grid-cols-1 grid-rows-[1fr_auto] gap-2 h-[calc(100dvh-110px)]"
        >
            <div className="py-4 relative h-full">
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
                <div>asdsa</div>
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
