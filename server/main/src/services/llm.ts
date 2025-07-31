import axios from "axios";
import envvars from "../constants/envvars";
import logger from "../lib/logger";
import type {
    ChatResponseType,
    LLMModesType,
    MessagesResponseType,
    SearchKeywordsResponseType,
} from "../types/services/llmTypes";
import type { ScrapResultResponseType } from "../types/services/websearchTypes";

const getSearchKeywords = async (
    query: string,
    session_id?: string
): Promise<string[]> => {
    try {
        const response = await axios.get(
            `${envvars.LLM_SERVICE_URL}/keywords?q=${query}${
                session_id ? `&session_id=${session_id}` : ""
            }`
        );

        const result: SearchKeywordsResponseType =
            response.data as SearchKeywordsResponseType;
        return result.output.keywords || [];
    } catch (error: any) {
        logger(`[Service: LLM] Error getting keywords: ${error.data}`, {
            level: "ERROR",
        });
        return [];
    }
};

const provideContext = async (
    data: ScrapResultResponseType["output"]
): Promise<boolean> => {
    try {
        const context: {
            text: string;
            meta: ScrapResultResponseType["output"][0]["metadata"];
        }[] = [];

        for (const item of data) {
            context.push({
                text: item.text || item.metadata?.description || "",
                meta: item.metadata || {},
            });
        }

        const response = await axios.post(
            `${envvars.LLM_SERVICE_URL}/context-provider`,
            { context }
        );
        const result = response.data as { success: boolean };
        return result.success || false;
    } catch (error: any) {
        logger(`[Service: LLM] Error providing context: ${error.data}`, {
            level: "ERROR",
        });
        return false;
    }
};

const chat = async (
    q: string,
    mode: LLMModesType = "AUTO",
    session_id?: string,
    search_id?: string | null,
    use_context: boolean = false
): Promise<ChatResponseType | null> => {
    try {
        const response = await axios.get(
            `${envvars.LLM_SERVICE_URL}/chat?q=${q}&mode=${mode}${
                session_id ? `&session_id=${session_id}` : ""
            }${use_context ? `&use_context=${use_context}` : ""}${
                search_id ? `&search_id=${search_id}` : ""
            }`
        );
        const result = response.data as ChatResponseType;
        return result;
    } catch (error: any) {
        logger(`[Service: LLM] Error in chat: ${error.data}`, {
            level: "ERROR",
        });
        return null;
    }
};

const messages = async (
    session_id: string,
    skip: number,
    limit: number
): Promise<MessagesResponseType | null> => {
    try {
        const response = await axios.get(
            `${envvars.LLM_SERVICE_URL}/messages?session_id=${session_id}&skip=${skip}&limit=${limit}`
        );
        const result = response.data as MessagesResponseType;
        return result;
    } catch (error: any) {
        logger(`[Service: LLM] Error providing context: ${error.data}`, {
            level: "ERROR",
        });
        return null;
    }
};

const llmService = {
    getSearchKeywords,
    provideContext,
    chat,
    messages,
};
export default llmService;
