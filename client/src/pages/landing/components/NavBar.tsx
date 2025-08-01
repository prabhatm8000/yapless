import Logo from "@/components/Logo";
import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import type { IUserState } from "@/redux/reducers/types";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { TbMenu } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const NavBar = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    const [showNavItems, setShowNavItems] = useState(false);

    const links = (
        <>
            <a href={"#home"}>Home</a>
            <a href={"#features"}>Features</a>
            <Link to={user?.isAuthenticated ? "/app/chat" : "/auth/login"}>
                <Button
                    variant="outline"
                    className="px-4 py-2 bg-transparent border-muted-foreground/40"
                >
                    {user?.isAuthenticated ? "Chat" : "Login"}
                </Button>
            </Link>
            {!user?.isAuthenticated && (
                <Link to={"/auth/signup"}>
                    <Button variant="default" className="px-4 py-2">
                        {"Sign up"}
                    </Button>
                </Link>
            )}
        </>
    );
    return (
        <nav
            className={`fixed w-full top-0 p-6 z-50  ${
                showNavItems ? "h-screen gap-6" : "h-auto"
            }`}
        >
            <div className="max-w-7xl mx-auto flex flex-col gap-4 relative">
                <div className={`flex gap-2 items-end justify-between p-4`}>
                    <Link to={"/"} className="">
                        <TitleText className="text-3xl flex gap-2 justify-start items-center">
                            <Logo />
                            <span className="hidden md:inline font-bold">
                                yapless
                            </span>
                        </TitleText>
                    </Link>

                    <div className="hidden md:flex gap-4 items-center justify-end">
                        {links}
                    </div>

                    <Button
                        variant={"outline"}
                        className="md:hidden transition-all duration-300 ease-out z-50"
                        onClick={() => setShowNavItems((p) => !p)}
                        size={"icon"}
                    >
                        <div
                            className={`transform ${
                                showNavItems ? "rotate-0" : "rotate-360"
                            } transition-all duration-500 ease-in-out`}
                        >
                            {showNavItems ? (
                                <IoIosClose className="size-8" />
                            ) : (
                                <TbMenu className="size-5" />
                            )}
                        </div>
                    </Button>
                </div>
                {showNavItems && (
                    <div className="left-0 flex flex-col p-4 gap-4 w-full md:hidden bg-muted-foreground/20 backdrop-blur-xs rounded-2xl border border-muted-foreground/20">
                        {links}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
