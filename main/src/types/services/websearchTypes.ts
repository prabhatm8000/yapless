export type WebSearchResponseType = {
    title?: string;
    description?: string;
    results?: {
        title?: string;
        description?: string;
        url?: string;
        scraperResult?: {
            metadata: {
                url: string;
                icon?: string | null;
                title?: string | null;
                description?: string | null;
            };
            title?: string | null;
            text?: string | null;
            html?: string | null;
            source: "axios" | "puppeteer";
        } | null;
    }[];
};

export type WebSearchCleanedForLLMType = {
    text: string;
    meta: {
        url: string;
        icon?: string | null;
        title?: string | null;
        description?: string | null;
    };
};
