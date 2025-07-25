import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import type { ApiResponseType } from "../reducers/types";

export const verifyUser = createAsyncThunk(
    "user/verify",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get("/user/verify");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const login = createAsyncThunk(
    "user/login",
    async (
        data: {
            email?: string;
            password?: string;
            credential?: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/user/login", data);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/logout");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/delete",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.delete("/user/delete");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
