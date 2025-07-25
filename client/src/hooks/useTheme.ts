import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeProvider";

const useTheme = () => {
    const context = useContext(ThemeContext);
    return context;
};

export default useTheme;
