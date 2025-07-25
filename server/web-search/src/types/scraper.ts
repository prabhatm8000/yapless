export interface SiteMetadataType {
    url: string;
    icon?: string | null;
    title?: string | null;
    description?: string | null;
}

export interface ScrapResult {
    metadata: SiteMetadataType;
    title?: string | null;
    text?: string | null;
    html?: string | null;
    source: "axios" | "puppeteer";
}
