-- CreateTable
CREATE TABLE "FetcherCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "result" JSONB NOT NULL
);
