import Logo from "@/components/Logo";
import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import type { IUserState } from "@/redux/reducers/types";
import { motion } from "framer-motion";
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
                    className="px-4 py-2 bg-transparent hover:bg-background/30 border-muted-foreground/40"
                >
                    {user?.isAuthenticated ? "Chat" : "Login"}
                </Button>
            </Link>
        </>
    );
    return (
        <motion.nav
            className={`fixed w-full top-0 p-6 z-50 ${
                showNavItems ? "h-screen gap-6" : "h-auto"
            }`}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
            }}
            transition={{
                delay: 1,
                duration: 1,
            }}
        >
            <div className="max-w-7xl mx-auto flex flex-col gap-4 relative backdrop-blur-[1.5px] shadow-2xl rounded-2xl">
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
                        className="md:hidden bg-transparent hover:bg-background/30 border-muted-foreground/40 transition-all duration-300 ease-out z-50"
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
                    <div className="left-0 flex flex-col p-4 gap-4 w-full md:hidden backdrop-blur-[1.5px] shadow-2xl rounded-2xl border-none">
                        {links}
                    </div>
                )}
            </div>
        </motion.nav>
    );
};

export default NavBar;
