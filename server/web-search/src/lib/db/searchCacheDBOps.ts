import type { InputJsonValue } from "../../../generated/prisma/runtime/library";
import { MAX_SEARCH_CACHE_LIFE } from "../../constants/webSearchConstants";
import prismaClient from "./prismaClient";

export const updateSearchCache = async (
    id: string,
    query: string,
    result: InputJsonValue
) =>
    prismaClient.searchCache.update({
        where: {
            id,
        },
        data: {
            query,
            result,
        },
    });

export const createSearchCache = async (
    query: string,
    result: InputJsonValue
) =>
    prismaClient.searchCache.create({
        data: {
            query,
            result,
        },
    });

/**
 * gets cached result for query
 * @returns
 */
export const getSearchCache = async (query: string) =>
    prismaClient.searchCache.findFirst({
        where: {
            query: query,
        },
    });

export const checkSearchCacheValidity = (updatedAt?: Date) =>
    updatedAt &&
    new Date().getTime() - new Date(updatedAt).getTime() <
        MAX_SEARCH_CACHE_LIFE;
