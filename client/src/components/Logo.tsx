import { TbHexagonLetterYFilled } from "react-icons/tb";

const Logo = ({ size }: { size?: number | string }) => {
    return (
        <TbHexagonLetterYFilled size={size || 36} />
        // <svg
        //     className="transform rotate-180 -scale-x-100"
        //     xmlns="http://www.w3.org/2000/svg"
        //     width={size || "36"}
        //     height={size || "36"}
        //     viewBox="0 0 24 24"
        //     fill="none"
        //     stroke="currentColor"
        //     strokeWidth="3"
        //     strokeLinecap="round"
        //     strokeLinejoin="round"
        // >
        //     <path d="M6 20l6.5 -9" />
        //     <path d="M19 20c-6 0 -6 -16 -12 -16" />
        // </svg>
    );
};

export default Logo;
