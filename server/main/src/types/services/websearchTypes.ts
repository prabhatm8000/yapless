export type WebSearchResponseType = {
    output: {
        title?: string;
        description?: string;
        results?: {
            title?: string;
            description?: string;
            url?: string;
        }[];
        provider?: string;
    };
    status: number;
    success: string;
};

export type SearchModesType = "AUTO" | "REDDIT" | "WIKIPEDIA" | null;

export interface SiteMetadataType {
    url: string;
    icon?: string | null;
    title?: string | null;
    description?: string | null;
    search_id: string;
}

export type ScrapResultResponseType = {
    output: {
        metadata: SiteMetadataType;
        title?: string | null;
        text?: string | null;
        html?: string | null;
        source: "axios" | "puppeteer";
    }[];
    status: number;
    success: string;
};
