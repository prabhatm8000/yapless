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
    const { q, mode, search, sessionId = null } = req.body;
    const query = q as string;
    const searchMode: LLMModesType = mode as LLMModesType;
    const searchEnabled: boolean = !!search;

    const userId = req.user!._id!;

    if (!query) return res.status(400).end("Missing query parameter `q`");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let contextProvidedFlag = false;

    // #region search enabled
    if (searchEnabled) {
        // #region keywords
        sendEventResponse(res, {
            event: "keywords",
            status: "PENDING",
            message: "Generating keywords...",
        });
        const keywords = await llmService.getSearchKeywords(query);
        sendEventResponse(res, {
            event: "keywords",
            status: "PENDING",
            data: keywords,
            message: "Searching web...",
        });

        // #region search
        const searchResults = await webSearchService.webSearch(keywords);
        if (!searchResults)
            return errorEventResponse(
                res,
                events.GOT_SEARCH_RESULTS,
                "No search results found."
            );

        // #region scrape
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
            event: "search",
            status: "PENDING",
            data: scrapeResults.output.map((result) => result.metadata),
            message: "Reading content...",
        });

        // #region context
        const context = await llmService.provideContext(scrapeResults.output);
        contextProvidedFlag = context;
        if (!context) {
            return errorEventResponse(
                res,
                events.GOT_CONTEXT,
                "Providing context failed."
            );
        }
    }

    // #region response
    sendEventResponse(res, {
        event: "response",
        status: "PENDING",
        message: "Generating response...",
    });
    const response = await llmService.chat(
        query,
        searchMode,
        sessionId,
        contextProvidedFlag
    );

    if (!response?.output?.session_id)
        return errorEventResponse(
            res,
            events.GOT_RESPONSE,
            "No session id found."
        );

    sendEventResponse(res, {
        event: "response",
        status: "COMPLETED",
        data: {
            sessionId: response.output.session_id,
            metadata: response.output.metadata,
            response: response.output.response,
            prompt: query,
            userId: userId,
        },
    });

    // sessionId is not provided on first request
    // #region getting title
    let gettingTitle = null;
    if (!sessionId) {
        gettingTitle = await llmService.chat(
            "give a title for this chat session, based on the User Query",
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
            data: {
                title: gettingTitle?.output?.response,
                userId,
                sessionId: response.output.session_id,
            },
        });
    }

    res.end();

    await chatHistoryService.addChatHistory({
        sessionId: response.output.session_id,
        userId: userId,
        metadata: response.output.metadata,
        prompt: query,
        response: response.output.response,
    });

    if (gettingTitle) {
        await chatService.createChat({
            userId: userId,
            sessionId: response.output.session_id,
            title: gettingTitle?.output?.response,
        });
    }
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

const getChatBySessionId = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req.user!._id!;
    const sessionId = req.params.sessionId as string;

    const chats = await chatService.getChatBySessionId(userId, sessionId);

    res.status(200).json({
        success: true,
        data: chats,
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
        data: { messages: ch, sessionId: sessionId },
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

const chatControllers = {
    startChat,
    getChats,
    getChatBySessionId,
    getChatHistory,
};
export default chatControllers;
