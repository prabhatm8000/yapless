import cors from "cors";
import envvars from "./envvars";

const CLIENT_URL = envvars.CLIENT_URL;
const originWhitelist = [
    CLIENT_URL,
    "http://localhost:1905",
    "http://localhost:5173",
];

export const corsConfig = cors({
    origin: function (origin, callback) {
        if (!origin || originWhitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Aaaah! Not allowed by CORS"));
        }
    },
    credentials: true,
});
