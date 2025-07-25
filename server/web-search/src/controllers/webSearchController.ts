import type { Request, Response } from "express";
import asyncWrapper from "../lib/asyncWrapper";
import { APIResponseError } from "../lib/error/apiError";
import { scraper } from "../lib/scraper/scraper";
import search from "../lib/search/search";
import type { ScrapResult } from "../types/scraper";
import type { SearchResultType } from "../types/search";

const webSearch = asyncWrapper(async (req: Request, res: Response) => {
    const query = req.query?.q || req.body?.q;
    const speedMode = req.query?.speedMode || req.body?.speedMode;
    if (!query) throw new APIResponseError("No query provided.", 400, false);

    const searchResult = await search(
        (query as string).toLowerCase(),
        speedMode === "true"
    );

    if (!searchResult || !searchResult.results) {
        console.log(searchResult);
        throw new APIResponseError(
            "Something went wrong while searching.",
            500,
            false
        );
    }
    return res.status(200).json({
        status: "success",
        success: true,
        output: searchResult,
    });
});

const scrape = asyncWrapper(async (req: Request, res: Response) => {
    const searchResult: SearchResultType = req.body;
    if (!searchResult || !searchResult.results) {
        throw new APIResponseError(
            "No search results provided for scraping.",
            400,
            false
        );
    }

    const scrapResult: (ScrapResult | null)[] = await Promise.all(
        searchResult.results.map(async (result) => {
            const data = await scraper(result);
            return data;
        })
    );

    res.status(200).json({
        status: "success",
        success: true,
        output: scrapResult.filter((result) => result !== null),
    });
});

const webSearchController = {
    webSearch,
    scrape,
};

export default webSearchController;
