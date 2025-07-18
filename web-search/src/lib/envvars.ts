import * as dotenv from "dotenv";

dotenv.config({
    quiet: true,
});

const envvars = {
    PORT: process.env.PORT || 3000,
    SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
};

export default envvars;
