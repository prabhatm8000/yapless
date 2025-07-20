import axios from "axios";
import envvars from "../lib/envvars";
import type { SearchKeywordsResponseType } from "../types/services/llmTypes";
import type { WebSearchCleanedForLLMType } from "../types/services/websearchTypes";
const getSearchKeywords = async (query: string): Promise<string[]> => {
    try {
        const response = await axios.get(
            `${envvars.LLM_SERVICE_URL}/keywords?q=${query}`
        );

        const result: SearchKeywordsResponseType =
            (response.data as SearchKeywordsResponseType) || {
                keywords: [],
            };
        return result.keywords || [];
    } catch (error) {
        console.error("Error fetching search keywords:", error);
        return [];
    }
};

const provideContext = async (
    context: WebSearchCleanedForLLMType[],
    query?: string
): Promise<any> => {
    try {
        const response = await axios.post(
            `${envvars.LLM_SERVICE_URL}/llm/context?q=${query || ""}`,
            { context }
        );
        return response.data || "";
    } catch (error: any) {
        console.error(
            "Error asking LLM:",
            error.status,
            error.message,
            error.data
        );
        return "";
    }
};

const llmService = {
    getSearchKeywords,
    provideContext,
};
export default llmService;
