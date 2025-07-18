-- CreateTable
CREATE TABLE "SearchAPIUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serpApiCalls" INTEGER NOT NULL,
    "tavilyApiCalls" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
