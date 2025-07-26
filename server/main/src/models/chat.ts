import mongoose from "mongoose";
import { IChat } from "../types/models/chat";

const chatSchema = new mongoose.Schema<IChat>(
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
        title: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

chatSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
