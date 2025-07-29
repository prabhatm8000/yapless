import { createSlice } from "@reduxjs/toolkit";
import { getChatHistory } from "../thunks/chatThunk";
import type { ApiResponseType, IChatHistory, IChatHistoryState } from "./types";

const initialState: IChatHistoryState = {
    chatHistory: {},
    responseEvent: [],
    hasMore: true,
    loading: false,
    error: null,
    message: null,
};

const chatHistorySlice = createSlice({
    name: "chatHistory",
    initialState,
    reducers: {
        clearState: (state: IChatHistoryState) => {
            state.chatHistory = {};
            state.loading = false;
            state.error = null;
            state.message = null;
        },
        clearStateExceptChatHistory: (state: IChatHistoryState) => {
            state.responseEvent = [];
            state.hasMore = true;
            state.loading = false;
            state.error = null;
            state.message = null;
        },
        addResponseEvent: (state, action) => {
            state.responseEvent = [...state.responseEvent, action.payload];
        },
        addToChatHistory: (
            state,
            action: { payload: { message: IChatHistory; sessionId: string } }
        ) => {
            state.responseEvent = [];
            const m = action.payload.message;
            const sId = action.payload.sessionId;

            // removing last mock element with loading = true
            // add as loader (in Prompt.tsx) while response comes
            if (
                state.chatHistory[sId] &&
                state.chatHistory[sId].length > 0 &&
                state.chatHistory[sId][0].loading
            ) {
                state.chatHistory[sId][0] = m;
            } else {
                state.chatHistory = {
                    ...state.chatHistory,
                    [sId]: [m, ...(state.chatHistory[sId] || [])],
                };
            }
        },
    },
    extraReducers: (builder) => {
        // getChatHistory
        builder.addCase(getChatHistory.fulfilled, (state, action) => {
            const data = (action.payload as ApiResponseType).data as {
                messages: IChatHistory[];
                sessionId: string;
            };

            if (data.messages?.length === 0) {
                state.hasMore = false;
            } else {
                state.chatHistory = {
                    ...state.chatHistory,
                    [data.sessionId]: [
                        ...(state.chatHistory[data.sessionId] || []),
                        ...data.messages,
                    ],
                };
            }
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getChatHistory.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getChatHistory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });
    },
});

export const {
    clearState,
    clearStateExceptChatHistory,
    addResponseEvent,
    addToChatHistory,
} = chatHistorySlice.actions;
export default chatHistorySlice.reducer;
