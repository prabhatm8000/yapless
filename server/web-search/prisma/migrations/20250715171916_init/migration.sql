/*
  Warnings:

  - Added the required column `month` to the `SearchAPIUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `SearchAPIUsage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SearchAPIUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serpApiCalls" INTEGER NOT NULL,
    "tavilyApiCalls" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SearchAPIUsage" ("createdAt", "id", "serpApiCalls", "tavilyApiCalls", "updatedAt") SELECT "createdAt", "id", "serpApiCalls", "tavilyApiCalls", "updatedAt" FROM "SearchAPIUsage";
DROP TABLE "SearchAPIUsage";
ALTER TABLE "new_SearchAPIUsage" RENAME TO "SearchAPIUsage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
