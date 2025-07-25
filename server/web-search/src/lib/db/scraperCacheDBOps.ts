import type { InputJsonValue } from "../../../generated/prisma/runtime/library";
import { MAX_SCRAPER_CACHE_LIFE } from "../../constants/scraperConstants";
import prismaClient from "./prismaClient";

export const updateScraperCache = async (
    id: string,
    url: string,
    result: InputJsonValue
) =>
    prismaClient.scraperCache.update({
        where: {
            id,
        },
        data: {
            url,
            result,
        },
    });

export const createScraperCache = async (url: string, result: InputJsonValue) =>
    prismaClient.scraperCache.create({
        data: {
            url,
            result,
        },
    });

/**
 * gets cached result for url
 * @returns
 */
export const getScraperCache = async (url: string) =>
    prismaClient.scraperCache.findFirst({
        where: {
            url: url,
        },
    });

export const checkScraperCacheValidity = (updatedAt?: Date) =>
    updatedAt &&
    new Date().getTime() - new Date(updatedAt).getTime() <
        MAX_SCRAPER_CACHE_LIFE;
