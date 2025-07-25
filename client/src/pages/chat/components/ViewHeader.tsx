import { IoIosLink } from "react-icons/io";
import { Link } from "react-router";
import TitleText from "../../../components/TitleText";

const ViewHeader = ({
    heading,
    subHeading,
}: {
    heading: string;
    subHeading?: string | React.ReactNode;
}) => {
    if (heading.length < 3) throw new Error("Heading too short, min length 3");
    return (
        <div className="sticky top-0 z-10">
            <div className="relative">
                {/* Top fade effect */}
                <div className="absolute top-full left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                <div className="flex flex-col gap-4 py-4 px-2 bg-background">
                    <Link to={"/"} className="hidden">
                        <TitleText className="text-xl flex gap-2 justify-start items-center">
                            <IoIosLink />
                            <span>Yapless</span>
                        </TitleText>
                    </Link>

                    <TitleText className="text-4xl font-bold">
                        {heading}
                    </TitleText>
                    <h4 className="text-sm text-muted-foreground">
                        {subHeading}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default ViewHeader;
