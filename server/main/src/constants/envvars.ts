import * as dotenv from "dotenv";

dotenv.config({
    quiet: true,
});

const envvars: any = {
    NODE_ENV: process.env.NODE_ENV || "dev",
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || "",
    WEB_SEARCH_SERVICE_URL: process.env.WEB_SEARCH_SERVICE_URL || "",
    LLM_SERVICE_URL: process.env.LLM_SERVICE_URL || "",
    MONGODB_URI: process.env.MONGODB_URI || "",
    DEV_CLIENT_URL: process.env.DEV_CLIENT_URL || "",
    PROD_CLIENT_URL: process.env.PROD_CLIENT_URL || "",
    DEV_SERVER_URL: process.env.DEV_SERVER_URL || "",
    PROD_SERVER_URL: process.env.PROD_SERVER_URL || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
};

for (const key in envvars) {
    if (!envvars[key]) {
        console.error(`Environment variable ${key} is not set.`);
        process.exit(1);
    }
}

export default envvars;
