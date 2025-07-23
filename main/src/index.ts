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
        console.log("Search Results:", searchResults);

        console.log("\n\nScraping...");
        const scrapeResults = await webSearchService.scrape(
            searchResults.output
        );
        if (!scrapeResults) {
            console.error("No results found after scraping.");
            return;
        }
        console.log("Scrape Results:", scrapeResults);

        console.log("\n\nProviding to Context...");
        const data = await llmService.provideContext(scrapeResults.output);
        console.log("Context provided to LLM:", data);

        console.log("\n\nGenerating response...");
        const response = await llmService.chat(query, "AUTO");
        console.log("Response:", response);

        if (!response?.output.session_id) {
            console.error("No session id found in response.");
            return;
        }

        console.log("\n\nGenerating more response...");
        const moreMessages = await llmService.chat(
            "what are the problem i'll face?",
            "AUTO",
            response?.output.session_id
        );
        console.log("Messages:", moreMessages);

        console.log("\n\nFetching messages...");
        const messages = await llmService.messages(
            response?.output.session_id,
            0,
            10
        );
        console.log("Messages:", messages);
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
