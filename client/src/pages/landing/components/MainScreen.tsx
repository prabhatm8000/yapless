import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const MainScreen = () => {
    return (
        <div className="h-screen w-screen">
            <div className="flex flex-col justify-center items-center gap-5 md:gap-10 pt-60">
                <h1 className="text-7xl md:text-9xl text-center font-extrabold">
                    yapless
                </h1>
                <h3 className="text-xl md:text-3xl text-center">
                    because you didn&apos;t ask for a TED talk.
                </h3>
            </div>
            <div className="flex justify-center mt-5">
                <Link to="/auth/login">
                    <Button>Get Started!</Button>
                </Link>
            </div>

            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundImage: `radial-gradient(circle 2000px at 50% 10px, var(--background), rgba(16,185,129,0.35))`,
                }}
            />
        </div>
    );
};

export default MainScreen;
