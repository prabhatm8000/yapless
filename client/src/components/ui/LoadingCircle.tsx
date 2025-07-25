import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import type React from "react";

const LoadingCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        className={cn(
            cva("")({
                className: props.className,
            })
        )}
        width={"36px"}
        height={"36px"}
        id="loading-svg"
        fill="currentColor"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g id="SVGRepo_iconCarrier">
            {/* Outer ring */}
            <path d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z" />

            {/* Dot at bottom */}
            <circle cx="16" cy="21" r="3" />
        </g>
    </svg>
);

export default LoadingCircle;
