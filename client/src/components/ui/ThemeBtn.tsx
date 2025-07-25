import useTheme from "@/hooks/useTheme";
import { IoSunnyOutline } from "react-icons/io5";
import { RiMoonClearLine } from "react-icons/ri";

const ThemeBtn = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            title="Ctrl + , -> to toggle theme"
            onClick={toggleTheme}
            className={`cursor-default transform text-muted-foreground ${
                theme === "light" ? "rotate-180" : "rotate-0"
            } transition-all duration-300 ease-out`}
        >
            {theme === "light" ? (
                <IoSunnyOutline className="size-5" />
            ) : (
                <RiMoonClearLine className="size-5" />
            )}
        </div>
    );
};

export default ThemeBtn;
