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
    userId: string,
    sessionId: string,
    skip: number = 0,
    limit: number = 5
): Promise<IChatHistory[]> => {
    return await ChatHistory.find({ userId, sessionId }, {}, { skip, limit });
};

const chatHistoryService: IChatHistoryService = {
    addChatHistory: addChatHistory,
    getChatHistoryBySessionId: getChatHistoryBySessionId,
};

export default chatHistoryService;
