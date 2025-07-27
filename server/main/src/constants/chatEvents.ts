import type { IChatProps } from "../types/models/chat";
import type { IChatHistoryProps } from "../types/models/chatHistory";
import type { SiteMetadataType } from "../types/services/websearchTypes";

type BaseEventDataType = {
    message?: string;
    status: "PENDING" | "COMPLETED" | "ERROR";
};

export type OtherEventDataType =
    | {
          event: "keywords";
          data?: string[];
      }
    | {
          event: "search";
          data?: SiteMetadataType[];
      }
    | {
          event: "context";
      }
    | {
          event: "response";
          data?: IChatHistoryProps;
      }
    | {
          event: "title";
          data?: IChatProps;
      };

export type EventDataType = BaseEventDataType & OtherEventDataType;

export const events: Record<string, OtherEventDataType["event"]> = {
    GOT_KEYWORDS: "keywords",
    GOT_SEARCH_RESULTS: "search",
    GOT_CONTEXT: "context",
    GOT_RESPONSE: "response",
    GOT_TITLE: "title",
};
