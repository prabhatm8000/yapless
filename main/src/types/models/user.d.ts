import type mongoose from "mongoose";
import type { IUsage } from "./usage";

export interface IUser extends mongoose.Document {
    _id: string | mongoose.Types.ObjectId;
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    isActive?: boolean;
    lastLogin?: Date;
    usageId?: mongoose.Types.ObjectId | string;
    usage?: IUsage;
}

export interface IUsersService {
    /**
     * --- google login ---
     * with credentialFromGoogleAuth
     * returns the user, if exists else creates a new user
     * @param param: {email: string, credentialFromGoogleAuth: any}
     * @returns
     */
    login: (params: { credentialFromGoogleAuth: any }) => Promise<IUser>;

    /**
     * options?.creatingWhileLogin === true, will set the lastLogin
     */
    createUser: (
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
    ) => Promise<IUser>;

    /**
     * authentication required, [id is checked in the auth middleware]
     * @param id
     * @returns
     */
    getUserById: (id: string) => Promise<IUser | undefined>;

    /**
     *
     * @param email
     * @returns
     */
    getUserByEmail: (email: string) => Promise<IUser | undefined>;

    /**
     * authentication required, [id is checked in the auth middleware]
     * @param id
     * @returns
     */
    deactivateUser: (id: string) => Promise<IUser | undefined>;

    deleteUser: (userId: string) => Promise<void>;
}
