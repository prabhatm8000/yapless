import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const handleScrollToTop = () => {
    const container = document.getElementById("main-screen");
    container?.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
    });
};

/**
 * handles id='main-screen'
 * @returns
 */
const ScrollToBottomBtn = () => {
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        const container = document.getElementById("main-screen");
        if (!container) return;
        const handleScroll = () => {
            if (
                container.scrollTop <
                container.scrollHeight - window.innerHeight - 100
            ) {
                setShowBtn(true);
            } else {
                setShowBtn(false);
            }
        };
        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [window.innerHeight]);

    return (
        <Button
            className={`text-2xl px-2 py-4 rounded-full transform ${
                showBtn ? "rotate-0 scale-100" : "rotate-180 scale-0"
            } transition-all duration-300 ease-out`}
            onClick={handleScrollToTop}
            variant="outline"
            size={"icon"}
            aria-label="Scroll to top"
        >
            <ArrowDown className="size-5" />
        </Button>
    );
};

export default ScrollToBottomBtn;
