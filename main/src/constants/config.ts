import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";

/**
 * @description Rate limiter for all routes.
 * @description 100 requests per 10 minutes for all routes.
 */
export const rateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});
