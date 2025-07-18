import express, { Express } from "express";
import envvars from "./lib/envvars";
import { apiErrorHandler } from "./lib/error/apiError";
import logger from "./lib/logger";
import webSearch from "./routes/webSearch";

const app: Express = express();
const PORT = parseInt(envvars.PORT as string);

// loggerConfig.filePath = "./logs";
// loggerConfig.fileName = "./logs";

app.use(express.json());
app.use(webSearch);
app.use(apiErrorHandler);

app.listen(PORT, () => {
    logger(`> 'Web search' service running on port ${PORT}`);
    console.log(`\n> 'Web search' service running on port ${PORT}\n`);
});
