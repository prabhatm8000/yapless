type ApiMessageType = string | { title: string; description: string };
export type ApiResponseType = {
    success: boolean;
    message: ApiMessageType;
    data: any;
};

export interface IUser {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    lastLogin?: Date;
    createdAt: string;
    updatedAt: string;
}

export interface IUserState {
    user: IUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    message: ApiMessageType | null;
}
