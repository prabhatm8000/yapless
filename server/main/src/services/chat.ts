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

const chatService: IChatService = {
    createChat: createChat,
    getChats: getChats,
};

export default chatService;
