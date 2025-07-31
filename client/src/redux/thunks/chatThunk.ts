import axiosInstance from "@/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiResponseType } from "../reducers/types";

export const getChatHistory = createAsyncThunk(
    "chatHistory/get",
    async (
        {
            sessionId,
            skip = 0,
            limit = 5,
        }: { sessionId: string; skip: number; limit?: number },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(`/chat/history`, {
                params: { sessionId, skip, limit },
            });
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getChats = createAsyncThunk(
    "chat/get",
    async (
        { skip = 0, limit = 5 }: { skip: number; limit?: number },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/chat", {
                params: { skip, limit },
            });
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getChatBySessionId = createAsyncThunk(
    "chat/getBySessionId",
    async (sessionId: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get(`/chat/${sessionId}`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const deleteChatBySessionId = createAsyncThunk(
    "chat/deleteBySessionId",
    async (sessionId: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/chat/${sessionId}`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
