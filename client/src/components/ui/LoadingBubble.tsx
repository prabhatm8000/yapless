import { cn } from "@/lib/utils";
import type React from "react";

interface ILoadingBubbleProps extends React.HTMLAttributes<HTMLSpanElement> {
    showAnimation?: boolean;
    colorClass?: string;
}

const LoadingBubble: React.FC<ILoadingBubbleProps> = (props) => (
    <span className={cn("relative inline-flex h-3 w-3", props.className)}>
        {props.showAnimation && (
            <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                    props.colorClass ? props.colorClass : "bg-foreground"
                } opacity-75`}
            ></span>
        )}
        <span
            className={`relative inline-flex size-3 rounded-full ${
                props.colorClass ? props.colorClass : "bg-foreground"
            }`}
        ></span>
    </span>
);

export default LoadingBubble;
