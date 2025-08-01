import Logo from "@/components/Logo";
import { Card } from "@/components/ui/card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type { IUserState } from "@/redux/reducers/types";
import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const userState: IUserState = useSelector((state: any) => state.user);

    return (
        <div className="h-dvh overflow-hidden relative">
            <div className="fixed top-0 left-0 m-6 z-20">
                <Link to="/" className="w-fit">
                    <Logo />
                </Link>
            </div>

            <div className="relative flex justify-center items-center w-full h-full xl:px-20">
                {userState?.loading && (
                    <div className="absolute w-full h-full bg-background/40 z-10">
                        <LoadingCircle className="size-5 absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2" />
                    </div>
                )}
                <Card className="max-w-82 lg:max-w-96 w-full rounded-lg bg-background/20 backdrop-blur-[1px] gap-4 py-4 transform slide-in-from-bottom-16 transition-transform duration-300">
                    {children}
                </Card>
            </div>

            <span className="fixed bottom-0 my-4 text-xs text-muted-foreground w-full text-center flex flex-col md:flex-row items-center md:items-start justify-start md:justify-center md:gap-1">
                <span>By clicking continue, you agree to our </span>
                <span>
                    <Link to={"/legal/terms"} className="underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to={"/legal/privacy"} className="underline">
                        Privacy Policy
                    </Link>
                </span>
            </span>

            {/* Concentric Squares - Light Pattern */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none "
                style={{
                    backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 5px, color-mix(in oklab, var(--muted-foreground) 10%, transparent) 5px, color-mix(in oklab, var(--muted-foreground) 10%, transparent) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(90deg, transparent, transparent 5px, color-mix(in oklab, var(--muted-foreground) 10%, transparent) 5px, color-mix(in oklab, var(--muted-foreground) 10%, transparent) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(0deg, transparent, transparent 10px, color-mix(in oklab, var(--muted-foreground) 5%, transparent) 10px, color-mix(in oklab, var(--muted-foreground) 5%, transparent) 11px, transparent 11px, transparent 30px),
        repeating-linear-gradient(90deg, transparent, transparent 10px, color-mix(in oklab, var(--muted-foreground) 5%, transparent) 10px, color-mix(in oklab, var(--muted-foreground) 5%, transparent) 11px, transparent 11px, transparent 30px)
      `,
                }}
            />
            {/* Your Content/Components */}
        </div>
    );
};

export default AuthLayout;
