import Logo from "@/components/Logo";
import { Link } from "react-router";
import TitleText from "../../../components/TitleText";

const ViewHeader = ({
    heading,
    subHeading,
}: {
    heading: string;
    subHeading?: string | React.ReactNode;
}) => {
    return (
        <div className="fixed top-0 w-4xl z-10">
            <div className="relative">
                {/* Top fade effect */}
                <div className="absolute top-full left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                <div className="flex flex-col gap-4 py-4 bg-background">
                    <Link to={"/"} className="md:hidden">
                        <TitleText className="text-xl flex gap-2 justify-start items-center">
                            <Logo />
                            <span>Yapless</span>
                        </TitleText>
                    </Link>

                    <TitleText className="text-2xl w-2xl truncate py-2">
                        {heading}
                    </TitleText>
                    {subHeading && (
                        <h4 className="text-sm text-muted-foreground">
                            {subHeading}
                        </h4>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewHeader;
