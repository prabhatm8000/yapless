import { createSlice } from "@reduxjs/toolkit";
import { deleteUser, login, logout, verifyUser } from "../thunks/userThunk";
import type { ApiResponseType, IUser, IUserState } from "./types";

const initialState: IUserState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearState: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        // verifyUser
        builder.addCase(verifyUser.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(verifyUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(verifyUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });

        // login
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });

        // logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });

        // delete user and logout
        builder.addCase(deleteUser.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });
    },
});

export default userSlice.reducer;
