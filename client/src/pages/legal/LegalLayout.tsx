import Logo from "@/components/Logo";
import type { ReactNode } from "react";
import { Link } from "react-router";

const LegalLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="max-w-7xl mx-auto py-4 px-6">
            <Link to="/" className="flex items-center gap-2">
                <Logo />
                <h1 className="text-2xl">Yapless</h1>
            </Link>
            <div className="md:mt-6">{children}</div>
        </div>
    );
};

export default LegalLayout;
