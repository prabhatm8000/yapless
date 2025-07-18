export const MAX_RESULTS = 5;

// max allowed by serpapi, 100/month
export const MAX_MONTHLY_QUERIES_SERP_API = 80;

// max allowed by tavily, 1000 credits/month, some req takes more credits, so can make around 300 requests/month
export const MAX_MONTHLY_QUERIES_TAVILY_API = 280;

export const MAX_SEARCH_CACHE_LIFE = 24 * 60 * 60 * 1000;
