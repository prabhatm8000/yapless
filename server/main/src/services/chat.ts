import type mongoose from "mongoose";
import Chat from "../models/chat";
import type { IChatProps, IChatService } from "../types/models/chat";

const createChat = async (props: IChatProps) => {
    const chat = await Chat.create(props);
    return chat;
};
const getChats = async (
    userId: IChatProps["userId"],
    skip: number = 0,
    limit: number = 5
) => {
    const chat = await Chat.aggregate([
        {
            $match: {
                userId,
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
    return chat;
};

const getChatBySessionId = async (
    userId: IChatProps["userId"],
    sessionId: IChatProps["sessionId"]
) => {
    const chat = await Chat.findOne({ userId, sessionId });
    return chat;
};

const deleteChatBySessionId = async (
    userId: IChatProps["userId"],
    sessionId: IChatProps["sessionId"],
    mongooseClientSession: mongoose.ClientSession
) => {
    const chat = await Chat.deleteOne(
        { userId, sessionId },
        {
            session: mongooseClientSession,
        }
    );
    return chat;
};

const chatService: IChatService = {
    createChat: createChat,
    getChats: getChats,
    getChatBySessionId: getChatBySessionId,
    deleteChatBySessionId: deleteChatBySessionId,
};

export default chatService;
