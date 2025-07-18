/*
  Warnings:

  - You are about to alter the column `year` on the `SearchAPIUsage` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SearchAPIUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serpApiCalls" INTEGER NOT NULL,
    "tavilyApiCalls" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SearchAPIUsage" ("createdAt", "id", "month", "serpApiCalls", "tavilyApiCalls", "updatedAt", "year") SELECT "createdAt", "id", "month", "serpApiCalls", "tavilyApiCalls", "updatedAt", "year" FROM "SearchAPIUsage";
DROP TABLE "SearchAPIUsage";
ALTER TABLE "new_SearchAPIUsage" RENAME TO "SearchAPIUsage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
