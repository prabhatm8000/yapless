import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router";

const MainScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="h-screen w-full relative flex flex-col justify-center"
            id="home"
        >
            <div className="flex flex-col justify-center items-center gap-5 md:gap-10">
                <h1
                    className="text-7xl md:text-9xl text-center font-[200]"
                    id="title"
                >
                    yapless
                </h1>
                <h3 className="text-xl md:text-3xl text-center font-extralight">
                    because you didn&apos;t ask for a
                    <span className="mx-1 px-1 text-white bg-red-700">TED</span>
                    talk.
                </h3>
            </div>

            <div className="flex justify-center mt-5">
                <Link to="/auth/login">
                    <Button>Chat to yapless!</Button>
                </Link>
            </div>

            <div
                className="absolute inset-0 -z-20"
                style={{
                    backgroundImage: `radial-gradient(circle 1000px at 50% -50%, var(--chart-5), transparent)`,
                }}
            />
        </motion.div>
    );
};

export default MainScreen;
