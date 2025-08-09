import { motion } from "framer-motion";
import FeaturesScreen from "./components/FeaturesScreen";
import Footer from "./components/Footer";
import MainScreen from "./components/MainScreen";
import NavBar from "./components/NavBar";

const LandingPage = () => {
    return (
        <div className="relative">
            <NavBar />
            <MainScreen />
            <FeaturesScreen />
            <Footer />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 1,
                    duration: 1,
                }}
            >
                <motion.div
                    className="fixed inset-0 -z-10 opacity-20"
                    style={{
                        backgroundImage: `
        linear-gradient(to right, var(--foreground) 0.1px, transparent 1px),
        linear-gradient(to bottom, var(--foreground) 0.1px, transparent 1px)
        `,
                        backgroundSize: "20px 20px",
                    }}
                    animate={{
                        backgroundPosition: ["0px 0px", "0px 60px"],
                    }}
                    transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />
            </motion.div>
        </div>
    );
};

export default LandingPage;
