import type { RateLimitRequestHandler } from "express-rate-limit";
import rateLimit from "express-rate-limit";

export const authCookieConfig = {
    authCookieName: "auth-cookie",
    httpOnly: true,
    secure: true,
    sameSite: "none" as "strict" | "lax" | "none",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};

/**
 * @description Strict rate limiter for auth routes.
 * @description 20 requests per 20 minutes for auth routes.
 */
export const authRateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    limit: 20, // Limit each IP to 20 requests per `window` (here, per 20 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});
