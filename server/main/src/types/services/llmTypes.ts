export type SearchKeywordsResponseType = {
    output: { keywords: string[]; q: string };
    status: number;
    success: string;
};

export type LLMModesType = "YAPLESS" | "BRIEF" | "DETAILED" | "AUTO";

export type ChatResponseType = {
    output: {
        session_id: string;
        response: string;
    };
    status: number;
    success: boolean;
};

export type MessagesResponseType = {
    output: {
        session_id: string;
        messages: { role: string; content: string }[];
        skip: number;
        limit: number;
    };
    success: boolean;
    status: number;
};
