import type { ChatResponseType } from "../types/services/llmTypes";
import type {
    ScrapResultResponseType,
    WebSearchResponseType,
} from "../types/services/websearchTypes";

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
          event: "search-results";
          data?: WebSearchResponseType;
      }
    | {
          event: "scrape-results";
          data?: ScrapResultResponseType;
      }
    | {
          event: "context";
          data?: boolean;
      }
    | {
          event: "response";
          data?: ChatResponseType;
      }
    | {
          event: "title";
          data?: string;
      };

export type EventDataType = BaseEventDataType & OtherEventDataType;

export const events: Record<string, OtherEventDataType["event"]> = {
    GOT_KEYWORDS: "keywords",
    GOT_SEARCH_RESULTS: "search-results",
    GOT_SCRAPE_RESULTS: "scrape-results",
    GOT_CONTEXT: "context",
    GOT_RESPONSE: "response",
    GOT_TITLE: "title",
};
