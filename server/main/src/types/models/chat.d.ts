import type mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IChatProps {
    userId: string | mongoose.Types.ObjectId;
    sessionId: string;
    title: string;
}

export interface IChat extends IChatProps, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IChatService {
    createChat: (props: IChatProps) => Promise<IChat>;
    getChats: (
        userId: IChatProps["userId"],
        skip: number = 0,
        limit: number = 5
    ) => Promise<IChat[] | null>;
    getChatBySessionId: (
        userId: IChatProps["userId"],
        sessionId: IChatProps["sessionId"]
    ) => Promise<IChat | null>;
}
