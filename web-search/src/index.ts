import express, { Express } from "express";
import webSearchController from "./controllers/webSearchController";
import envvars from "./lib/envvars";
import { apiErrorHandler } from "./lib/error/apiError";
import logger from "./lib/logger";

const app: Express = express();
const PORT = parseInt(envvars.PORT as string);

// loggerConfig.filePath = "./logs";
// loggerConfig.fileName = "./logs";

app.use(express.json());
app.get("/websearch", webSearchController.webSearch);
app.post("/scrape", webSearchController.scrape);
app.use(apiErrorHandler);

app.listen(PORT, () => {
    logger(`> 'Web search' service running on port ${PORT}`);
    console.log(`\n> 'Web search' service running on port ${PORT}\n`);
});
