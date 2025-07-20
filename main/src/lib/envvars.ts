import * as dotenv from "dotenv";

dotenv.config({
    quiet: true,
});

const envvars = {
    PORT: process.env.PORT || 5000,
    WEB_SEARCH_SERVICE_URL: process.env.WEB_SEARCH_SERVICE_URL || "",
    LLM_SERVICE_URL: process.env.LLM_SERVICE_URL || "",
};

export default envvars;
