import { useState } from "react";
import SideBar, { SideBarBtn } from "./components/SideBar";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    const [showSideBar, setShowSideBar] = useState<boolean>(false);
    return (
        <div className="relative h-dvh md:grid grid-cols-[auto_1fr] gap-0 overflow-hidden">
            {/* black overlay, when sidebar is open, smaller screen */}
            <div
                onClick={() => setShowSideBar(false)}
                className={`${
                    showSideBar ? "fixed md:hidden" : "hidden"
                } z-40 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[1px]`}
            />

            <SideBar
                className={`fixed md:static z-50 top-0 left-0 transition-transform duration-500 ease-out ${
                    showSideBar
                        ? "translate-x-0"
                        : "-translate-x-[100%] md:translate-x-0"
                }`}
                setShowSideBar={() => setShowSideBar((p) => !p)}
            />

            {/* body */}
            <div
                id="main-screen"
                className="flex justify-center gap-4 h-full w-full overflow-y-scroll px-4"
            >
                <div className="w-full max-w-6xl h-full">
                    <div>{children}</div>
                    <SideBarBtn
                        showSideBar={showSideBar}
                        onClick={() => setShowSideBar((p) => !p)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;
