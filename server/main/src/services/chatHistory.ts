import mongoose from "mongoose";
import ChatHistory from "../models/chatHistory";
import type {
    IChatHistory,
    IChatHistoryProps,
    IChatHistoryService,
} from "../types/models/chatHistory";

const addChatHistory = async (
    chatHistory: IChatHistoryProps
): Promise<IChatHistory> => {
    return await ChatHistory.create(chatHistory);
};

const getChatHistoryBySessionId = async (
    userId: string | mongoose.Types.ObjectId,
    sessionId: string,
    skip: number = 0,
    limit: number = 5
): Promise<IChatHistory[]> => {
    return await ChatHistory.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                sessionId,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);
};

const deleteChatHistoryBySessionId = async (
    userId: string | mongoose.Types.ObjectId,
    sessionId: string,
    mongooseClientSession: mongoose.ClientSession
) => {
    return await ChatHistory.deleteMany(
        {
            userId: new mongoose.Types.ObjectId(userId),
            sessionId,
        },
        {
            session: mongooseClientSession,
        }
    );
};

const chatHistoryService: IChatHistoryService = {
    addChatHistory: addChatHistory,
    getChatHistoryBySessionId: getChatHistoryBySessionId,
    deleteChatHistoryBySessionId: deleteChatHistoryBySessionId,
};

export default chatHistoryService;
