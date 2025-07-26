import type { Response } from "express";
import type {
    EventDataType,
    OtherEventDataType,
} from "../constants/chatEvents";

export const sendEventResponse = (res: Response, data: EventDataType) => {
    res.write(`${JSON.stringify(data)}\n\n`);
};

export const errorEventResponse = (
    res: Response,
    event: OtherEventDataType["event"],
    msg: string
) => {
    sendEventResponse(res, {
        event: event,
        status: "ERROR",
        message: msg,
    });
    res.end();
};
