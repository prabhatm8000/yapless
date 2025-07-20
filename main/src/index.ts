import { cleanSearchResultForLLM } from "./lib/textProcessing";
import llmService from "./services/llm";
import webSearchService from "./services/websearch";

const main = async (query: string) => {
    try {
        console.log("\n\nGenerating keywords...");
        const keywords = await llmService.getSearchKeywords(query);
        console.log("Keywords:", keywords);

        console.log("\n\nSearching web...");
        const searchResults = await webSearchService.webSearch(keywords);

        if (!searchResults) {
            console.error("No search results found.");
            return;
        }

        console.log("\n\nCleaning Search Results...");
        const formattedResultForLLM = cleanSearchResultForLLM(searchResults);

        console.log("\n\nProviding to Context...");
        const data = await llmService.provideContext(
            formattedResultForLLM,
            query
        );
        console.log("Context provided to LLM:", data?.data);
    } catch (error: any) {
        console.error(
            "An error occurred:",
            error?.status,
            error?.message,
            error?.data
        );
    }
};

main("should I avoid eating green vegetables during monsoon season?");
