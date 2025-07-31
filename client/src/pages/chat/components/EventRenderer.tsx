import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingBubble from "@/components/ui/LoadingBubble";
import type { EventDataType } from "@/types/events";
import { Search } from "lucide-react";

const EventRenderer = ({
    showLoading,
    event,
}: {
    showLoading: boolean;
    event?: EventDataType;
}) => {
    if (!event) return <></>;
    let comp = <></>;
    switch (event.event) {
        case "keywords":
            comp = (
                <div className="flex flex-wrap items-center gap-4">
                    {event.data?.map((kw, i) => (
                        <span
                            key={i}
                            className="px-2 p-0.5 border border-border rounded-md bg-muted-foreground/10 flex items-center gap-2"
                        >
                            <Search className="size-4" />
                            {kw}
                        </span>
                    ))}
                </div>
            );
            break;
        case "search":
            comp = (
                <div className="max-h-80 max-w-lg flex flex-col gap-1 overflow-y-auto">
                    {event.data?.map((site, i) => (
                        <a
                            target="_blank"
                            href={site.url}
                            key={i}
                            className="px-2 p-0.5 border border-border rounded-md bg-muted-foreground/10 flex items-center gap-2 hover:bg-muted-foreground/15"
                        >
                            <Avatar className="size-4">
                                <AvatarImage
                                    src={site.icon!}
                                    alt={site.title!}
                                />
                                <AvatarFallback itemType="link" />
                            </Avatar>
                            <span className="w-lg truncate">{site.title}</span>
                        </a>
                    ))}
                </div>
            );
            break;
        default:
            comp = <div></div>;
    }
    return (
        <div className="flex gap-2">
            <LoadingBubble
                className="m-2"
                showAnimation={event.status === "PENDING" && showLoading}
                colorClass={
                    event.status === "ERROR" ? "bg-red-500" : "bg-green-500"
                }
            />
            <div className="flex flex-col gap-2">
                <h6 className="text-muted-foreground">{event.message}</h6>
                <div>{comp}</div>
            </div>
        </div>
    );
};

export default EventRenderer;
