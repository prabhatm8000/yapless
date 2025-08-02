import { TbHexagonLetterYFilled } from "react-icons/tb";

const Logo = ({
    size,
    className,
}: {
    size?: number | string;
    className?: string;
}) => {
    return <TbHexagonLetterYFilled size={size || 36} className={className} />;
};

export default Logo;
