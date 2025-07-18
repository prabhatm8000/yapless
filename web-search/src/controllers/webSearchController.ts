import type { Request, Response } from "express";
import asyncWrapper from "../lib/asyncWrapper";
import { APIResponseError } from "../lib/error/apiError";
import { scraper } from "../lib/scraper/scraper";
import search from "../lib/search/search";
import type { ScrapResult } from "../types/scraper";

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

    const scrapResult: (ScrapResult | null)[] = await Promise.all(
        searchResult.results.map(async (result) => {
            const data = await scraper(result.url!);
            return data; // could be null
        })
    );

    const data: {
        title?: string;
        description?: string;
        results?: {
            title?: string;
            description?: string;
            url?: string;
            scraperResult?: ScrapResult | null;
        }[];
    } = {
        title: searchResult.title,
        description: searchResult.description,
        results: [],
    };

    for (let i = 0; i < searchResult.results.length; i++) {
        data.results?.push({
            title: searchResult.results[i].title,
            description: searchResult.results[i].description,
            url: searchResult.results[i].url,
            scraperResult: scrapResult[i],
        });
    }

    res.status(200).json(data);
});

const webSearchController = {
    webSearch,
};

export default webSearchController;
