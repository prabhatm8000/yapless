import mongoose from "mongoose";
import type { IUser } from "../types/models/user";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 50,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxlength: 100,
            minlength: 3,
        },
        profilePicture: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        usageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usage",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
