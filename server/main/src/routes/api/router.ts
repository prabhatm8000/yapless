import { Router, type Request, type Response } from "express";
import asyncWrapper from "../../lib/asyncWrapper";
import { APIResponseError, apiErrorHandler } from "../../lib/error/apiError";
import chatsRouter from "./chatRoutes";
import usersRouter from "./userRoutes";

const apiRouter = Router();

// testing route
apiRouter.get(
    "/",
    asyncWrapper(async (req: Request, res: Response) => {
        res.status(200).json({
            message: "Welcome to the API!",
            success: true,
            data: {
                name: "API",
                version: "1.0.0",
                description: "API working fine.",
            },
        });
    })
);
apiRouter.use("/user", usersRouter);
apiRouter.use("/chat", chatsRouter);

// invalid route
apiRouter.use((req: Request, res: Response) => {
    throw new APIResponseError("Invalid route", 404, false);
});

// error handler
apiRouter.use(apiErrorHandler);

export default apiRouter;
