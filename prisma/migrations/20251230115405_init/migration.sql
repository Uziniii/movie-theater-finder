-- CreateTable
CREATE TABLE "cinemas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "cinemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "director" TEXT NOT NULL,
    "cast" TEXT,
    "duration" INTEGER,
    "poster" TEXT NOT NULL,
    "release" TIMESTAMP(3) NOT NULL,
    "synopsis" TEXT,
    "genres" TEXT NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "showTime" TIMESTAMP(3) NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_cinemas_1" ON "cinemas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_movies_1" ON "movies"("title");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_movies_2" ON "movies"("originalTitle");

-- CreateIndex
CREATE INDEX "idx_schedules_showTime" ON "schedules"("showTime");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "cinemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
