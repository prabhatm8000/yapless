import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { rateLimiter } from "./constants/config";
import { corsConfig } from "./constants/corsConfig";
import envvars from "./constants/envVars";
import { connectToDB } from "./lib/mongodb";
import router from "./routes/router";

const app: Express = express();
const PORT = parseInt(envvars.PORT as string);

// for prod, ui files will be served by express, so it'll be [same-site]
if (envvars.NODE_ENV === "dev") {
    app.use(corsConfig);

    // log requests
    app.use(function (req, res, next) {
        console.log(
            `[${req.method}] ${req.originalUrl} - ${new Date().toISOString()}`
        );
        next();
    });
}

app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(PORT, "0.0.0.0", () => {
    connectToDB()
        .catch((err) => {
            console.log(err);
            process.exit(1);
        })
        .finally(() => {
            console.log("Database connected successfully");
            console.log(
                `Server is running on ${PORT} in ${envvars.NODE_ENV} mode`
            );
        });
});
