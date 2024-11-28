import { Cron } from "croner";
import { db } from "./db/db.ts";
import { seed } from "./db/seed.ts";
import { scraping } from "./scraping.ts";
import type { Cinema } from "./types/schema.ts";
import { parseArgs } from "util";
import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { Movies } from "./db/models/Movies.ts";
import { Schedules } from "./db/models/Schedules.ts";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    "no-seed": {
      type: 'boolean',
    },
    "scraping": {
      type: 'boolean'
    }
  },
  strict: true,
  allowPositionals: true,
});

if (!values["no-seed"]) {
  seed(db)
}

const job = new Cron("@daily", async () => {
  const cinemas = db.query("SELECT * FROM cinemas").all() as Cinema[];

  let movies = Array.from((await scraping(cinemas)).values())

  db.exec("DELETE FROM movies")
  db.exec("DELETE FROM schedules")

  const insertMovie = db.prepare("INSERT INTO movies (title, director, cast, duration, poster, release, synopsis, genres) VALUES ($title, $director, $cast, $duration, $poster, $release, $synopsis, $genres)")
  const insertShowtime = db.prepare("INSERT INTO schedules (cinemaId, movieId, showTime) VALUES ($cinemaId, $movieId, $showTime)")

  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];

    let schedule = Object.entries(m.schedule);

    // @ts-ignore
    delete m.schedule

    let tM: any = Object.fromEntries(
      Object
        .entries(m)
        .map(([key, value]) => [`$${key}`, value])
    )

    tM.$cast = tM.$cast.join(",")
    tM.$genres = tM.$genres.join(",")
    tM.$release = tM.$release.toJSON()

    let id = insertMovie.run(tM as any).lastInsertRowid

    for (let j = 0; j < schedule.length; j++) {
      const [cinemaId, showtimes] = schedule[j];

      for (let k = 0; k < showtimes.length; k++) {
        const showtime = showtimes[k];

        insertShowtime.run({
          $cinemaId: cinemaId,
          $movieId: id,
          $showTime: showtime.toJSON()
        } as any)
      }
    }
  }
})

if (values.scraping) {
  job.trigger()
}

const app = new Elysia()
  .use(staticPlugin({
    assets: "./dist/assets",
    prefix: "/assets"
  }))
  .decorate("movies", new Movies())
  .decorate("schedules", new Schedules())
  .get("/", () => Bun.file("./dist/index.html"))
  .group("/api", (app) =>
    app
      .get("/movies", ({ movies, schedules, query }) => {
        const date = new Date(query.date ?? Date.now())
        const maxPage = Math.floor(movies.getCount(date) / 15)
        let page = query.page ?? 1

        if (page > maxPage) page = maxPage

        const moviesToday = movies.get(date, page)

        return {
          maxPage,
          movies: moviesToday,
          schedules: schedules.get(moviesToday, date)
        }
      }, {
        query: t.Object({
          date: t.Optional(t.String()),
          page: t.Optional(t.Number({ minimum: 1 })),
        })
      })
  )
  .listen(3000)