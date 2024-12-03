-- CreateTable
CREATE TABLE "cinemas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT,
    "duration" INTEGER,
    "poster" TEXT NOT NULL,
    "release" DATETIME NOT NULL,
    "synopsis" TEXT,
    "genres" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cinemaId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "showTime" DATETIME NOT NULL,
    CONSTRAINT "schedules_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "schedules_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "cinemas" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_cinemas_1" ON "cinemas"("name");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_movies_1" ON "movies"("title");
Pragma writable_schema=0;

-- CreateIndex
CREATE INDEX "idx_schedules_showTime" ON "schedules"("showTime");
