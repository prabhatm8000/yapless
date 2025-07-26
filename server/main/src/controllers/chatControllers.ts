import type { Request, Response } from "express";
import { events } from "../constants/chatEvents";
import asyncWrapper from "../lib/asyncWrapper";
import { APIResponseError } from "../lib/error/apiError";
import { errorEventResponse, sendEventResponse } from "../lib/responseBuilder";
import chatService from "../services/chat";
import chatHistoryService from "../services/chatHistory";
import llmService from "../services/llm";
import webSearchService from "../services/websearch";
import type { LLMModesType } from "../types/services/llmTypes";

const startChat = asyncWrapper(async (req: Request, res: Response) => {
    const { q, mode, search, sessionId } = req.body;
    const query = q as string;
    const searchMode: LLMModesType = mode as LLMModesType;
    const searchEnabled: boolean = !!search;

    if (!query) return res.status(400).end("Missing query parameter `q`");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // #region search enabled
    if (searchEnabled) {
        console.log("search enabled");
        // #region keywords
        sendEventResponse(res, {
            event: "keywords",
            status: "PENDING",
            message: "Generating keywords...",
        });
        const keywords = await llmService.getSearchKeywords(query);
        sendEventResponse(res, {
            event: "keywords",
            status: "COMPLETED",
            data: keywords,
        });

        // #region search
        sendEventResponse(res, {
            event: "search-results",
            status: "PENDING",
            message: "Searching web...",
        });
        const searchResults = await webSearchService.webSearch(keywords);
        if (!searchResults)
            return errorEventResponse(
                res,
                events.GOT_SEARCH_RESULTS,
                "No search results found."
            );
        sendEventResponse(res, {
            event: "search-results",
            status: "COMPLETED",
            data: searchResults,
        });

        // #region scrape
        sendEventResponse(res, {
            event: "scrape-results",
            status: "PENDING",
            message: "Scraping...",
        });
        const scrapeResults = await webSearchService.scrape(
            searchResults.output
        );
        if (!scrapeResults)
            return errorEventResponse(
                res,
                events.GOT_SCRAPE_RESULTS,
                "Scraping failed."
            );
        sendEventResponse(res, {
            event: "scrape-results",
            status: "COMPLETED",
            data: scrapeResults,
        });

        // #region context
        sendEventResponse(res, {
            event: "context",
            status: "PENDING",
            message: "Generating context...",
        });
        const context = await llmService.provideContext(scrapeResults.output);
        sendEventResponse(res, {
            event: "context",
            status: "COMPLETED",
            data: context,
        });
    }

    // #region response
    sendEventResponse(res, {
        event: "response",
        status: "PENDING",
        message: "Generating response...",
    });
    const response = await llmService.chat(query, searchMode, sessionId);
    if (!response?.output?.session_id)
        return errorEventResponse(
            res,
            events.GOT_RESPONSE,
            "No session id found."
        );
    sendEventResponse(res, {
        event: "response",
        status: "COMPLETED",
        data: response,
    });

    // #region getting title
    sendEventResponse(res, {
        event: "title",
        status: "PENDING",
        message: "Generating title...",
    });
    const gettingTitle = await llmService.chat(
        "give a title for this chat session",
        searchMode,
        response.output.session_id
    );
    if (!gettingTitle?.output?.session_id)
        return errorEventResponse(
            res,
            events.GOT_RESPONSE,
            "No session id found."
        );
    sendEventResponse(res, {
        event: "title",
        status: "COMPLETED",
        data: gettingTitle?.output?.response,
    });

    res.end();

    await chatHistoryService.addChatHistory({
        sessionId: response.output.session_id,
        userId: req.user!._id!,
        metadata: response.output.metadata,
        prompt: query,
        response: response.output.response,
    });

    await chatService.createChat({
        userId: req.user!._id!,
        sessionId: response.output.session_id,
        title: gettingTitle?.output?.response,
    });
});

const getChatHistory = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req.user!._id!;
    const sessionId = req.query.sessionId as string;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!sessionId) {
        throw new APIResponseError("Missing sessionId", 400, false);
    }

    const ch = await chatHistoryService.getChatHistoryBySessionId(
        userId,
        sessionId,
        skip,
        limit
    );
    res.status(200).json({
        success: true,
        messages: "",
        data: ch,
    });
});

const getChats = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req.user!._id!;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const chats = await chatService.getChats(userId, skip, limit);

    res.status(200).json({
        success: true,
        data: chats,
    });
});

// const deleteChat = asyncWrapper(async (req: Request, res: Response) => {
//     const sessionId = req.query.sessionId as string;
//     if (!sessionId) {
//         throw new APIResponseError("Missing sessionId", 400, false);
//     }

//     res.status(200).json({
//         success: true,
//         data: "",
//     });
// });

const chatControllers = { startChat, getChatHistory, getChats };
export default chatControllers;
