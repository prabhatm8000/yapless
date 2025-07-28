import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={cn(
                "relative flex size-8 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        />
    );
}

function AvatarImage({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn("aspect-square size-full", className)}
            {...props}
        />
    );
}

function AvatarFallback({
    className,
    itemType,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
    let colorGrd = "bg-gradient-to-br ";
    switch (itemType) {
        case "link":
            colorGrd += "from-emerald-400 via-blue-500 to-indigo-600";
            break;
        case "workspace":
            colorGrd += "from-pink-400 to-red-700";
            break;
        case "people":
        default:
            colorGrd += "from-yellow-300 via-amber-500 to-red-600";
    }
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(
                "text-white text-xs cursor-default font-semibold flex size-full items-center justify-center rounded-full",
                colorGrd,
                className
            )}
            {...props}
        />
    );
}

export { Avatar, AvatarFallback, AvatarImage };
