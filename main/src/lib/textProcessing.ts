import type {
    WebSearchCleanedForLLMType,
    WebSearchResponseType,
} from "../types/services/websearchTypes";

export const cleanSearchResultForLLM = (
    searchResult: WebSearchResponseType
): WebSearchCleanedForLLMType[] => {
    if (!searchResult.results) {
        return [
            {
                text: searchResult.description || "",
                meta: {
                    url: "",
                    icon: null,
                    title: searchResult.title || null,
                    description: null,
                },
            },
        ];
    }

    return searchResult.results?.map((result) => {
        if (!result.scraperResult) {
            return {
                text: result.description || "",
                meta: {
                    url: result.url || "",
                    icon: null,
                    title: result.title || null,
                    description: null,
                },
            };
        }

        const sr = result.scraperResult;
        return {
            text: sr.text || "",
            meta: {
                url: sr.metadata.url,
                icon: sr.metadata.icon || null,
                title: sr.metadata.title || null,
                description: sr.metadata.description || null,
            },
        };
    });
};
