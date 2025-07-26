import mongoose from "mongoose";
import { IChatHistory } from "../types/models/chatHistory";

const chatHistorySchema = new mongoose.Schema<IChatHistory>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        sessionId: {
            type: String,
            required: true,
        },
        metadata: {
            type: [Object],
            required: true,
            default: [],
        },
        prompt: {
            type: String,
            rerquired: true,
        },
        response: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

chatHistorySchema.index({ userId: 1, sessionId: 1 });

const ChatHistory = mongoose.model<IChatHistory>(
    "ChatHistory",
    chatHistorySchema
);
export default ChatHistory;
