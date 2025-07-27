import { createSlice } from "@reduxjs/toolkit";
import { getChatHistory } from "../thunks/chatThunk";
import type { ApiResponseType, IChatHistory, IChatHistoryState } from "./types";

const initialState: IChatHistoryState = {
    chatHistory: {},
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
            state.hasMore = true;
            state.loading = false;
            state.error = null;
            state.message = null;
        },
        addToChatHistory: (
            state,
            action: { payload: { message: IChatHistory; sessionId: string } }
        ) => {
            const m = action.payload.message;
            const sId = action.payload.sessionId;
            state.chatHistory = {
                ...state.chatHistory,
                [sId]: [...state.chatHistory[sId], m],
            };
        },
    },
    extraReducers: (builder) => {
        // getChatHistory
        builder.addCase(getChatHistory.fulfilled, (state, action) => {
            const data = (action.payload as ApiResponseType).data as {
                messages: IChatHistory[];
                sessionId: string;
            };

            if (data.messages.length === 0) {
                state.hasMore = false;
            } else {
                state.chatHistory = {
                    ...state.chatHistory,
                    [data.sessionId]: data.messages,
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

export const { clearState, clearStateExceptChatHistory, addToChatHistory } =
    chatHistorySlice.actions;
export default chatHistorySlice.reducer;
