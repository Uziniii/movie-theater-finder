/*
  Warnings:

  - A unique constraint covering the columns `[allocineId]` on the table `movies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[allocineInternalId]` on the table `movies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[allocineInternalId]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cinemaId,movieId,showTime,version]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `allocineInternalId` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "sqlite_autoindex_movies_1";

-- DropIndex
DROP INDEX "sqlite_autoindex_movies_2";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "allocineId" TEXT,
ADD COLUMN     "allocineInternalId" INTEGER NOT NULL,
ADD COLUMN     "allocineRaw" JSONB;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "allocineInternalId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "movies_allocineId_key" ON "movies"("allocineId");

-- CreateIndex
CREATE UNIQUE INDEX "movies_allocineInternalId_key" ON "movies"("allocineInternalId");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_allocineInternalId_key" ON "schedules"("allocineInternalId");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_cinemaId_movieId_showTime_version_key" ON "schedules"("cinemaId", "movieId", "showTime", "version");
