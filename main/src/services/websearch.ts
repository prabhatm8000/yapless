import axios from "axios";
import envvars from "../lib/envvars";
import type { WebSearchResponseType } from "../types/services/websearchTypes";

const webSearch = async (
    query: string | string[]
): Promise<WebSearchResponseType | null> => {
    if (typeof query !== "string") {
        query = query.join(", ");
    }
    try {
        const response = await axios.get(
            `${envvars.WEB_SEARCH_SERVICE_URL}?q=${query}`
        );

        const results: WebSearchResponseType =
            (response.data as WebSearchResponseType) || null;

        return results;
    } catch (error) {
        console.error("Error fetching web search results:", error);
        return null;
    }
};

const webSearchService = {
    webSearch,
};

export default webSearchService;
