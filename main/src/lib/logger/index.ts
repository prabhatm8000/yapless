import fs from "fs";
import type { LoggerOptionsType } from "./type";

/**
 * loggerConfig
 * filePath: path to log file, ex- ./logs
 * fileName: name of log file, ex- web-search
 * level: default log level, ex- INFO
 */
export const loggerConfig: LoggerOptionsType = {
    filePath: "./logs",
    fileName: "web-search",
    level: "INFO",
};

const logger = (message: string, options?: LoggerOptionsType) => {
    const level = options?.level || loggerConfig.level;
    const filePath = options?.filePath || loggerConfig.filePath;
    if (!filePath) {
        throw new Error("filePath is not set in loggerConfig.");
    }

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    if (!fs.existsSync(`${filePath}/${loggerConfig.fileName}.log`)) {
        fs.writeFileSync(`${filePath}/${loggerConfig.fileName}.log`, "");
    }

    const localtime = new Date();
    const logtime = `${localtime.getFullYear()}-${(localtime.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${localtime
        .getDate()
        .toString()
        .padStart(2, "0")} ${localtime
        .getHours()
        .toString()
        .padStart(2, "0")}:${localtime
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${localtime
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

    const log = `${logtime} - [${level}] - ${message}\n\n`;
    fs.appendFileSync(`${filePath}/${loggerConfig.fileName}.log`, log);
};

export default logger;
