import type { Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { authCookieConfig } from "../constants/authConfig";
import envvars from "../constants/envvars";
import { APIResponseError } from "./error/apiError";

const JWT_SECRET = envvars.JWT_SECRET as string;

// #region auth
export const setAuthCookie = (res: Response, payload: any) => {
    const token = jwt.sign({ payload }, JWT_SECRET, {
        expiresIn: "3d",
    });
    res.cookie(authCookieConfig.authCookieName, token, {
        ...authCookieConfig, // httpOnly secure sameSite maxAge
    });
};

export const getAuthCookie = async (req: any): Promise<any> => {
    const token = req?.cookies?.[authCookieConfig.authCookieName];

    if (!token) {
        throw new APIResponseError("", 401, false);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded.payload) {
        throw new APIResponseError("", 401, false);
    }

    return (decoded as JwtPayload).payload;
};

export const removeAuthCookie = (res: Response) => {
    res.clearCookie(authCookieConfig.authCookieName);
};

// #endregion auth
