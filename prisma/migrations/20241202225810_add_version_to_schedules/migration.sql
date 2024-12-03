/*
  Warnings:

  - Added the required column `version` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cinemaId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "showTime" DATETIME NOT NULL,
    "version" TEXT NOT NULL,
    CONSTRAINT "schedules_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "schedules_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "cinemas" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_schedules" ("cinemaId", "id", "movieId", "showTime") SELECT "cinemaId", "id", "movieId", "showTime" FROM "schedules";
DROP TABLE "schedules";
ALTER TABLE "new_schedules" RENAME TO "schedules";
CREATE INDEX "idx_schedules_showTime" ON "schedules"("showTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
