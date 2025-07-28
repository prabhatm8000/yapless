import { cn } from "@/lib/utils";
import type React from "react";

const LoadingBubble: React.FC<React.HTMLAttributes<HTMLSpanElement>> = (
    props
) => (
    <span className={cn("relative inline-flex h-3 w-3", props.className)}>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-foreground"></span>
    </span>
);

export default LoadingBubble;
