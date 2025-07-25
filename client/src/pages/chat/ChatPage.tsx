import { useSearchParams } from "react-router";
import type { SideBarTabType } from "./components/SideBar";
import ViewHeader from "./components/ViewHeader";
import ChatView from "./views/ChatView";
import ProfileView from "./views/ProfileView";
import SettingsView from "./views/SettingsView";

const ChatPage = () => {
    const [searchParams, _] = useSearchParams();

    let page: {
        heading: string;
        subHeading: string;
        viewNode: React.ReactNode;
    } | null = null;
    switch (searchParams.get("tab") as SideBarTabType) {
        case "profile":
            page = {
                heading: "Profile",
                subHeading: "Manage your profile",
                viewNode: <ProfileView />,
            };
            break;
        case "settings":
            page = {
                heading: "Settings",
                subHeading: "Manage your yapless settings",
                viewNode: <SettingsView />,
            };
            break;
        case "chat":
        default:
            page = {
                heading: "Chat",
                subHeading: "Talk to yapless",
                viewNode: <ChatView />,
            };
            break;
    }

    return (
        <>
            <ViewHeader heading={page.heading} subHeading={page.subHeading} />
            {page.viewNode}
        </>
    );
};

export default ChatPage;
