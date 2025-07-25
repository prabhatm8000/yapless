import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext<{
    theme: "light" | "dark";
    toggleTheme: () => void;
    setTheme: (theme: "light" | "dark") => void;
}>({
    theme: "light",
    toggleTheme: () => {},
    setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [theme, setTheme] = useState<"light" | "dark">(
        localStorage.theme === "dark" ? "dark" : "light"
    );

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        const gettingTheme =
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark"
                : "light";

        setTheme(gettingTheme);
        document.documentElement.setAttribute("data-theme", gettingTheme);
        root.classList.add(gettingTheme);
    }, [theme]);

    useEffect(() => {
        const handleListener = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === ",") toggleTheme();
        };
        addEventListener("keydown", handleListener);
        return () => {
            removeEventListener("keydown", handleListener);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
