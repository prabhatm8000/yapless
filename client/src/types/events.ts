import type {
    IChat,
    IChatHistory,
    SiteMetadataType,
} from "@/redux/reducers/types";

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
          data?: IChatHistory;
      }
    | {
          event: "title";
          data?: IChat;
      };

export type EventDataType = BaseEventDataType & OtherEventDataType;
