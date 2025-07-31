export type SearchResultItemType = {
    title?: string;
    description?: string;
    url?: string;
    search_id: string;
};

export type SearchResultType = {
    title?: string;
    description?: string;
    results?: SearchResultItemType[];
    provider?: string;
};
