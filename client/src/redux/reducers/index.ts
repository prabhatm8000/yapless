import { combineReducers } from "@reduxjs/toolkit";
import chat from "./chat";
import chatHistory from "./chatHistory";
import user from "./user";

const rootReducer = combineReducers({
    user,
    chatHistory,
    chat,
});

export default rootReducer;
