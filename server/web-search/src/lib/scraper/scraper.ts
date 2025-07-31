import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";

import type { ScrapResult } from "../../types/scraper";
import {
    checkScraperCacheValidity,
    createScraperCache,
    getScraperCache,
    updateScraperCache,
} from "../db/scraperCacheDBOps";
import logger from "../logger";
import { cleanText } from "../textProcessing";

async function cheerioScrape(
    html: string
): Promise<{ text: string; html: string }> {
    const $ = cheerio.load(html);
    const bodyText = $("body").text();
    return {
        text: cleanText(bodyText),
        html: cleanText($.html()),
    };
}

export async function puppeteerHtmlScrape(url: string): Promise<string> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();

        // Block unnecessary resources
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const blocked = ["image", "stylesheet", "font", "media"];
            if (blocked.includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setUserAgent("Mozilla/5.0 (compatible; MyScraperBot/1.0)");
        await page.setViewport({ width: 800, height: 600 });

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 10000,
        });

        const html = await page.content();
        return html;
    } finally {
        await browser.close();
    }
}

export async function scraper(siteMeta: {
    title?: string;
    description?: string;
    url?: string;
    search_id: string;
}): Promise<ScrapResult | null> {
    if (!siteMeta || !siteMeta.url) {
        logger("[Scraper] No URL provided", { level: "ERROR" });
        return null;
    }

    try {
        const dataFromCache = await getScraperCache(siteMeta.url);
        const flag = checkScraperCacheValidity(dataFromCache?.updatedAt);
        if (dataFromCache && flag && dataFromCache.result) {
            logger(`[Cache] scraping url: ${siteMeta.url}`, { level: "INFO" });
            return dataFromCache.result as unknown as ScrapResult;
        }

        let htmlContent: string | undefined;
        try {
            htmlContent = await puppeteerHtmlScrape(siteMeta.url);
            if (!htmlContent) throw new Error("Puppeteer failed.");
        } catch (e) {
            logger(`[Puppeteer] Failed to fetch content: ${siteMeta.url}`, {
                level: "ERROR",
            });
            return {
                metadata: {
                    url: siteMeta.url,
                    title: siteMeta.title,
                    description: siteMeta.description,
                    icon: null,
                    search_id: siteMeta.search_id,
                },
                title: siteMeta.title || "",
                text: siteMeta.description || "",
                html: "",
                source: "fallback",
            };
        }

        const dom = new JSDOM(htmlContent, { url: siteMeta.url });
        const document = dom.window.document;

        const cheerioResult = await cheerioScrape(htmlContent || "");
        const text = cheerioResult.text;
        const html = cheerioResult.html;
        const title = cleanText(
            document.querySelector("title")?.textContent || "Untitled"
        );

        const doc = dom.window.document;
        const metadata: ScrapResult["metadata"] = {
            url: siteMeta.url,
            title: doc.querySelector("title")?.textContent || null,
            description:
                doc
                    .querySelector("meta[name='description']")
                    ?.getAttribute("content") || null,
            icon: null,
            search_id: siteMeta.search_id,
        };

        const iconLink = doc.querySelector("link[rel~='icon']");
        const favicon = iconLink?.getAttribute("href") || null;
        if (favicon) {
            const base = new URL(siteMeta.url);
            metadata.icon = new URL(favicon, base.origin).href;
        }

        const data: ScrapResult = {
            metadata,
            title,
            text,
            html,
            source: "cheerio + puppeteer",
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

        logger(`[Success] Scraped: ${siteMeta.url}`, { level: "INFO" });
        return data;
    } catch (error: any) {
        logger(`[Scraper Error] ${siteMeta.url} - ${error.message}`, {
            level: "ERROR",
        });

        return {
            metadata: {
                url: siteMeta.url,
                title: siteMeta.title,
                description: siteMeta.description,
                icon: null,
                search_id: siteMeta.search_id,
            },
            title: siteMeta.title || "",
            text: siteMeta.description || "",
            html: "",
            source: "fallback",
        };
    }
}
