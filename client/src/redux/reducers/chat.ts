import { createSlice } from "@reduxjs/toolkit";
import { deleteChatBySessionId, getChats } from "../thunks/chatThunk";
import type { ApiResponseType, IChat, IChatState } from "./types";

const initialState: IChatState = {
    chats: [],
    hasMore: true,
    loading: false,
    error: null,
    message: null,
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addChat: (state, action: { payload: IChat }) => {
            state.chats = [action.payload, ...state.chats];
        },
        removeChat: (state, action) => {
            state.chats = state.chats.filter(
                (c) => c.sessionId !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        // getChats
        builder.addCase(getChats.fulfilled, (state, action) => {
            const data = (action.payload as ApiResponseType).data as IChat[];
            if (data.length === 0) {
                state.hasMore = false;
            } else {
                state.chats = [...state.chats, ...data];
            }

            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getChats.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getChats.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });

        // deleteChatBySessionId
        builder.addCase(deleteChatBySessionId.fulfilled, (state, action) => {
            const data = (action.payload as ApiResponseType).data as {
                sessionId: string;
            };
            state.chats = state.chats.filter(
                (c) => c.sessionId !== data.sessionId
            );
            state.loading = false;
        });
        builder.addCase(deleteChatBySessionId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });
        builder.addCase(deleteChatBySessionId.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
    },
});

export const { addChat, removeChat } = chatSlice.actions;
export default chatSlice.reducer;
