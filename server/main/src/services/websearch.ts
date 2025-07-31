import axios from "axios";
import envvars from "../constants/envvars";
import logger from "../lib/logger";
import type {
    ScrapResultResponseType,
    SearchModesType,
    WebSearchResponseType,
} from "../types/services/websearchTypes";

const webSearch = async (
    query: string | string[],
    searchMode: SearchModesType
): Promise<WebSearchResponseType | null> => {
    if (typeof query !== "string") {
        query = query.join(", ");
    }
    try {
        let site = "";
        if (searchMode === "REDDIT") {
            site = "site:reddit.com";
        } else if (searchMode === "WIKIPEDIA") {
            site = "site:wikipedia.org";
        }
        const response = await axios.get(
            `${envvars.WEB_SEARCH_SERVICE_URL}/websearch?q=${site} ${query}`
        );

        const results: WebSearchResponseType =
            (response.data as WebSearchResponseType) || null;

        return results;
    } catch (error: any) {
        logger(
            `[Service: WebSearch] Error fetching web search results: ${error.data}`,
            {
                level: "ERROR",
            }
        );
        return null;
    }
};

const scrape = async (
    searchResult: WebSearchResponseType["output"] | string | { url: string }
): Promise<ScrapResultResponseType | null> => {
    try {
        const response = await axios.post(
            `${envvars.WEB_SEARCH_SERVICE_URL}/scrape`,
            searchResult
        );

        const results: ScrapResultResponseType =
            response.data as ScrapResultResponseType;

        return results;
    } catch (error: any) {
        logger(
            `[Service: WebSearch] Error scraping web search results: ${error.data}`,
            {
                level: "ERROR",
            }
        );
        return null;
    }
};

const webSearchService = {
    webSearch,
    scrape,
};

export default webSearchService;
