import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteMetadataType } from "@/redux/reducers/types";
import { useEffect, useState } from "react";

const ChatMetadataRenderer = ({
    metadata,
}: {
    metadata: SiteMetadataType[];
}) => {
    const [meta, setMeta] = useState<SiteMetadataType[]>(metadata);

    useEffect(() => {
        const m = metadata.map((m) => {
            if (!m.url) return m;
            const urlObj = new URL(m.url!);
            if (!m.icon?.startsWith("http")) {
                const host = urlObj.host;
                const iconUrl = `https://${host}/${m.icon}`;
                return { ...m, icon: iconUrl };
            }
            return m;
        });
        setMeta(m);
    }, [metadata]);

    const onClickHandler = (url: string) => {
        const alink = document.createElement("a");
        alink.href = url;
        alink.target = "_blank";
        alink.click();
    };
    return (
        <div className="flex gap-4 w-full h-full overflow-x-auto">
            {meta.map((m, i) =>
                m.url ? (
                    <Card
                        className="py-2 min-w-32 w-full max-w-44 hover:bg-muted-foreground/5 shadow-none"
                        key={i}
                    >
                        <CardHeader
                            className="px-2 cursor-pointer"
                            onClick={() => onClickHandler(m.url)}
                        >
                            <CardTitle className="flex items-start gap-2">
                                <Avatar className="size-5">
                                    <AvatarImage src={m.icon!} alt={m.title!} />
                                    <AvatarFallback itemType="link" />
                                </Avatar>
                                <span className="line-clamp-2 break-all text-xs text-muted-foreground">
                                    {m.title || m.description || m.url}
                                </span>
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ) : (
                    <></>
                )
            )}
        </div>
    );
};

export default ChatMetadataRenderer;
