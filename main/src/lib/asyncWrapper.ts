import type { NextFunction, Request, Response } from "express";

const asyncWrapper = (
    callback: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<Response | void>
) => {
    return (req: Request, res: Response, next: NextFunction) =>
        callback(req, res, next).catch(next);
};

export default asyncWrapper;
