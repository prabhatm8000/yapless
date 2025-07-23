import { Readability } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";
import type { ScrapResult } from "../../types/scraper";
import {
    checkScraperCacheValidity,
    createScraperCache,
    getScraperCache,
    updateScraperCache,
} from "../db/scraperCacheDBOps";
import logger from "../logger";
import { cleanText } from "../textProcessing";

export async function scraper(siteMeta: {
    title?: string;
    description?: string;
    url?: string;
}): Promise<ScrapResult | null> {
    if (!siteMeta || !siteMeta.url) {
        logger("[Scraper] No URL provided", { level: "ERROR" });
        return null;
    }
    try {
        const dataFromCache = await getScraperCache(siteMeta.url);
        const flag = checkScraperCacheValidity(dataFromCache?.updatedAt);
        if (dataFromCache && flag) {
            if (dataFromCache.result) {
                logger(`[Cache] scraping url: ${siteMeta.url}`, {
                    level: "INFO",
                });
                const data = dataFromCache.result as any;
                return data as ScrapResult;
            }
        }

        const res = await axios.get(siteMeta.url, {
            headers: {
                "User-Agent": "MyRAG-Bot/1.0",
                Accept: "text/html",
            },
            timeout: 5000,
        });

        // remove styles
        const cleanHTML = res.data.replace(
            /<style[^>]*>[\s\S]*?<\/style>/gi,
            ""
        );
        const dom = new JSDOM(cleanHTML, { url: siteMeta.url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();
        if (
            !article ||
            (article?.textContent && article?.textContent.length < 500)
        )
            return null;

        const title = cleanText(article.title);
        const text = cleanText(article.textContent);
        const html = cleanText(article.content);

        const metadata: ScrapResult["metadata"] = {
            url: siteMeta.url,
            title: null,
            description: null,
            icon: null,
        };

        const iconLink = dom.window.document.querySelector("link[rel~='icon']");
        const favicon = iconLink ? iconLink.getAttribute("href") : null;
        const titleElement = dom.window.document.querySelector("title");
        const descriptionElement = dom.window.document.querySelector(
            "meta[name='description']"
        );

        if (titleElement) metadata.title = titleElement.textContent;
        if (descriptionElement)
            metadata.description = descriptionElement.textContent;
        if (favicon) metadata.icon = favicon;

        const data: ScrapResult = {
            metadata,
            title,
            text,
            html,
            source: "axios",
        };

        if (dataFromCache) {
            await updateScraperCache(
                dataFromCache.id,
                siteMeta.url,
                data as any
            );
        } else {
            await createScraperCache(siteMeta.url, data as any);
        }

        logger(`[Fetch] scraping url: ${siteMeta.url}`, { level: "INFO" });
        return data;
    } catch (error: any) {
        logger(`[Fetch] scraping url: ${siteMeta.url}`, { level: "ERROR" });
        return {
            metadata: {
                url: siteMeta.url,
                title: siteMeta.title,
                description: siteMeta.description,
                icon: null,
            },
            title: siteMeta.title,
            text: siteMeta.description || "",
            html: "",
            source: "axios",
        };
    }
}
