export type LoggerLevelType = "INFO" | "WARN" | "ERROR";
export type LoggerOptionsType = {
    level: LoggerLevelType;
    filePath?: string;
    fileName?: string;
};
