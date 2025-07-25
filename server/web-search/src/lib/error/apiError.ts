import type { NextFunction, Request, Response } from "express";
import logger from "../logger";

export class APIResponseError extends Error {
    public status: number;
    public success: boolean;
    constructor(
        message: string,
        status: number = 500,
        success: boolean = false
    ) {
        super(message);
        this.status = status;
        this.success = success;
    }
}

export const apiErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger(error.message, { level: "ERROR" });
    if (error instanceof APIResponseError) {
        res.status(error.status).json({
            success: error.success,
            message: error.message,
        });
    } else {
        console.log(req.url, error?.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }
};
