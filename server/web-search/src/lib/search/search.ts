import axios from "axios";
import { v7 as uuidv7 } from "uuid";
import {
    MAX_MONTHLY_QUERIES_SERP_API,
    MAX_MONTHLY_QUERIES_TAVILY_API,
    MAX_RESULTS,
} from "../../constants/webSearchConstants";
import type { SearchResultType } from "../../types/search";
import { getUsageCount, updateUsageCount } from "../db/searchAPIUsageDBOps";
import {
    checkSearchCacheValidity,
    createSearchCache,
    getSearchCache,
    updateSearchCache,
} from "../db/searchCacheDBOps";
import envvars from "../envvars";
import logger from "../logger";
import { cleanText } from "../textProcessing";

/**
 * @param query
 * @returns
 * @link doc -> https://serpapi.com/search-api
 */
export const serpAPIWebSearch = async (
    query: string
): Promise<SearchResultType | null> => {
    const usageData = await getUsageCount();
    if (usageData?.serpApiCalls >= MAX_MONTHLY_QUERIES_SERP_API) {
        throw new Error("Monthly limit reached.");
    }

    try {
        const response = await axios(
            `https://serpapi.com/search.json?q=${query}&engine=google&num=${MAX_RESULTS}&api_key=${envvars.SERPAPI_API_KEY}`
        );

        const result = response.data;
        if (result?.search_metadata?.status !== "Success") {
            throw new Error(
                result?.search_metadata?.error ||
                    "Something went wrong while searching."
            );
        }

        await updateUsageCount(usageData.id, "serpApiCalls", 1);

        const output: SearchResultType = {
            title: result?.knowledge_graph?.title,
            description: result?.knowledge_graph?.description,
            results: result?.organic_results?.map((r: any) => ({
                title: r?.title,
                description: r?.snippet,
                url: r?.link,
            })),
            provider: "serpapi",
        };
        return output;
    } catch (error) {
        await updateUsageCount(usageData.id, "serpApiCalls", 1);
        return null;
    }
};

/**
 * @param query
 * @returns
 * @link doc -> https://app.tavily.com/playground
 */
export const tavilyWebSearch = async (
    query: string
): Promise<SearchResultType> => {
    const usageData = await getUsageCount();
    if (usageData?.tavilyApiCalls >= MAX_MONTHLY_QUERIES_TAVILY_API) {
        throw new Error("Monthly limit reached.");
    }

    try {
        const response = await axios.post(
            "https://api.tavily.com/search",
            {
                query,
                max_results: MAX_RESULTS,
                search_depth: "advanced",
                include_answer: "advanced",
            },
            {
                headers: {
                    Authorization: `Bearer ${envvars.TAVILY_API_KEY}`,
                },
            }
        );

        const result = response.data;
        if (!result) {
            throw new Error("Something went wrong while searching.");
        }

        await updateUsageCount(usageData.id, "tavilyApiCalls", 1);

        const output: SearchResultType = {
            title: result?.title || result?.query,
            description: result?.answer,
            results: result?.results?.map((r: any) => ({
                title: r?.title,
                description: r?.content,
                url: r?.url,
            })),
            provider: "tavily",
        };
        return output;
    } catch (error) {
        await updateUsageCount(usageData.id, "tavilyApiCalls", 1);
        throw error;
    }
};

/**
 * Try using Tavily first, and fallback to SerpAPI
 * forceFasterSearch will try serpAPI first, and fallback to tavily
 * @param query
 * @param forceFasterSearch
 * @returns
 */
const search = async (query: string, forceFasterSearch = false) => {
    let sr: SearchResultType | null;
    const cachedResult = await getSearchCache(query);
    const flag = checkSearchCacheValidity(cachedResult?.updatedAt);
    if (cachedResult && flag) {
        logger(`[Cache] - searching query: "${query}"`, { level: "INFO" });
        return cachedResult.result as SearchResultType;
    }

    // serpAPI is faster
    // tavily gives more free credits
    if (forceFasterSearch) {
        sr = await serpAPIWebSearch(query);
        if (!sr?.results?.length) {
            sr = await tavilyWebSearch(query);
        }
    } else {
        sr = await tavilyWebSearch(query);
        if (!sr?.results?.length) {
            sr = await serpAPIWebSearch(query);
        }
    }

    const search_id = uuidv7();

    const data = {
        ...sr,
        title: cleanText(sr?.title),
        description: cleanText(sr?.description),
        results: sr?.results?.map((r) => ({
            ...r,
            title: cleanText(r?.title),
            description: cleanText(r?.description),
            search_id,
        })),
    };

    if (data) {
        if (cachedResult && data.results) {
            await updateSearchCache(cachedResult.id, query, data);
        } else {
            await createSearchCache(query, data);
        }
    }

    logger(`[Fetch] - searching query: "${query}"`, { level: "INFO" });
    return data;
};

export default search;
