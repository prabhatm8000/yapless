/*
  Warnings:

  - Added the required column `updatedAt` to the `FetcherCache` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FetcherCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_FetcherCache" ("id", "result", "url") SELECT "id", "result", "url" FROM "FetcherCache";
DROP TABLE "FetcherCache";
ALTER TABLE "new_FetcherCache" RENAME TO "FetcherCache";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
