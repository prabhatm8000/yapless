import type { EventDataType } from "@/types/events";

type ApiMessageType = string | { title: string; description: string };
// #region user
export type ApiResponseType = {
    success: boolean;
    message: ApiMessageType;
    data: any;
};

export interface IUser {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    lastLogin?: Date;
    createdAt: string;
    updatedAt: string;
}

export interface IUserState {
    user: IUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    message: ApiMessageType | null;
}

export type SiteMetadataType = {
    url: string;
    icon?: string | null;
    title?: string | null;
    description?: string | null;
};
// #endregion

// #region chat history
export interface IChatHistory {
    userId: string;
    sessionId: string;
    metadata: SiteMetadataType[];
    prompt: string;
    response: string;
    loading?: boolean;
}

export interface IChatHistoryState {
    /**
     * sessionId -> messages
     */
    chatHistory: Record<string, IChatHistory[]>;
    responseEvent: EventDataType[];
    hasMore: boolean;
    loading: boolean;
    error: string | null;
    message: ApiMessageType | null;
}

export type ChatHistoryResponseType = Record<
    string,
    {
        skip: number;
        limit: number;
        data: {
            metadata: SiteMetadataType;
            prompt: string;
            response: string;
        }[];
    }[]
>;
// #endregion

// #region chat
export interface IChat {
    userId: string;
    sessionId: string;
    title: string;
}

export interface IChatState {
    chats: IChat[];
    hasMore: boolean;
    loading: boolean;
    error: string | null;
    message: ApiMessageType | null;
}
// #endregion
