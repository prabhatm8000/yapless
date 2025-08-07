import express, { Express, type Request, type Response } from "express";
import webSearchController from "./controllers/webSearchController";
import envvars from "./lib/envvars";
import { apiErrorHandler } from "./lib/error/apiError";

const app: Express = express();
const PORT = parseInt(envvars.PORT as string);

// loggerConfig.filePath = "./logs";
// loggerConfig.fileName = "./logs";

app.use(express.json());

app.use(function (req, res, next) {
    console.log(
        `[${req.method}] ${req.originalUrl} - ${new Date().toISOString()}`
    );
    next();
});
app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to the API!",
        success: true,
        data: {
            name: "API",
            version: "1.0.0",
            description: "API working fine.",
        },
    });
});
app.get("/websearch", webSearchController.webSearch);
app.post("/scrape", webSearchController.scrape);
app.use(apiErrorHandler);

app.listen(PORT, () => {
    console.log(`\n> 'Web search' service running on port ${PORT}\n`);
});
