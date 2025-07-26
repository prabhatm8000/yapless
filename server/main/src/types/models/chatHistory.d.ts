import type { Document } from "mongoose";
import type { SiteMetadataType } from "../services/websearchTypes";

export interface IChatHistoryProps {
    userId: string | mongoose.Types.ObjectId;
    sessionId: string;
    metadata: SiteMetadataType[];
    prompt: string;
    response: string;
}

export interface IChatHistory extends IChatHistoryProps, Document {}

export interface IChatHistoryService {
    /**
     * Adds a new chat history with sessionId, prompt + metadata + response
     * @param chatHistory
     * @returns
     */
    addChatHistory: (chatHistory: IChatHistoryProps) => Promise<IChatHistory>;

    /**
     * Get chat history by sessionId, for a given user
     * @param userId
     * @param sessionId
     * @param skip
     * @param limit
     * @returns
     */
    getChatHistoryBySessionId: (
        userId,
        sessionId: string,
        skip: number = 0,
        limit: number = 5
    ) => Promise<IChatHistory[]>;
}
