import mongoose from "mongoose";
import envvars from "../constants/envvars";
import { APIResponseError } from "../lib/error/apiError";
import oauthClient from "../lib/oAuthClient";
import User from "../models/user";
import type { IUser, IUsersService } from "../types/models/user";

/**
 * --- local login ---
 * with email and password
 * returns the user, if exists else throws error
 *
 * --- google login ---
 * with credentialFromGoogleAuth
 * returns the user, if exists else creates a new user
 * @param param: {email: string, password: string, credentialFromGoogleAuth: any}
 * @returns
 */
const login = async ({
    credentialFromGoogleAuth,
}: {
    credentialFromGoogleAuth: any;
}) => {
    let user = null;
    if (!credentialFromGoogleAuth) {
        throw new APIResponseError("Credential is required", 400, false);
    }

    // perform google auth
    const ticket = await oauthClient.verifyIdToken({
        idToken: credentialFromGoogleAuth,
        audience: envvars.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new APIResponseError("Invalid token", 401, false);
    }

    const findingUser = await User.findOne({ email: payload.email });
    if (!findingUser && payload.email) {
        user = await createUser(
            {
                name: payload.name || "",
                email: payload.email,
                profilePicture: payload.picture,
            },
            {
                creatingWhileLogin: true,
            }
        );
    } else {
        user = findingUser;
    }

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    return user as IUser;
};

/**
 *
 * @param: {name: string, email: string, password: string, profilePicture: string}
 * @returns
 */
const createUser = async (
    {
        name,
        email,
        profilePicture,
    }: {
        name: string;
        email: string;
        profilePicture?: string;
    },
    options?: {
        session?: mongoose.ClientSession;
        creatingWhileLogin?: boolean;
    }
) => {
    const session = options?.session
        ? options?.session
        : await mongoose.startSession();
    if (!options?.session) {
        // session from outside will be handled from there only, don't care!
        session.startTransaction();
    }

    const userId = new mongoose.Types.ObjectId();
    const usageId = new mongoose.Types.ObjectId();
    const user = new User({
        _id: userId,
        name,
        email,
        profilePicture,
        usageId,
        lastLogin: options?.creatingWhileLogin ? new Date() : undefined,
    });
    // const usage = new Usage({
    //     _id: usageId,
    //     userId: user._id,
    //     workspaceCount: 1, // cause we are creating a dummy workspace
    //     linkCount: [],
    // });

    await user.save({ session });
    // await usage.save({ session });

    if (!options?.session) {
        // session from outside will be handled from there only, don't care!
        await session.commitTransaction();
    }
    return user.toJSON() as IUser;
};

/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @returns
 */
const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user?.toJSON() as IUser;
};

/**
 *
 * @param email
 * @returns
 */
const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    return user?.toJSON() as IUser;
};

/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @returns
 */
const deactivateUser = async (id: string) => {
    const user = await User.findByIdAndUpdate(
        id,
        {
            isActive: false,
        },
        { new: false }
    );
    return user?.toJSON() as IUser;
};

const deleteUser = async (userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findByIdAndDelete(userId, { session });
        if (!user) throw new APIResponseError("User not found", 404, false);
        // await Usage.deleteOne({ userId }, { session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
};

const usersService: IUsersService = {
    login: login,
    createUser: createUser,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    deactivateUser: deactivateUser,
    deleteUser: deleteUser,
};

export default usersService;
