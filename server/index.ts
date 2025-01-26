import { Cron } from "croner";
import { client } from "./db/client.ts";
import { parseArgs } from "util";
import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { Movies, MOVIES_PER_PAGE } from "./db/models/Movies.ts";
import { Schedules } from "./db/models/Schedules.ts";
import { getMoviesData } from "@/fetch-allocine.ts";
import cinemas from "@/../prisma/cinemas.json"
import { compression } from 'elysia-compress'

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    "fetch": {
      type: 'boolean'
    }
  },
  strict: true,
  allowPositionals: true,
});

await client.cinemas.createMany({
  data: cinemas,
  skipDuplicates: true
})

const job = new Cron("@daily", async () => {
  let startTime = performance.now()

  const cinemas = await client.cinemas.findMany();

  const [moviesMap, requestNumber] = await getMoviesData(cinemas)
  const movies = Array.from(moviesMap.values())

  await client.$transaction(async (tx) => {
    await tx.schedules.deleteMany()
    await tx.movies.deleteMany()

    for (let i = 0; i < movies.length; i++) {
      const { title, originalTitle, cast, director, duration, genres, poster, release, schedule, synopsis } = movies[i];

      const finalSchedule = []
      const keys = Object.keys(schedule)

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];

        finalSchedule.push(
          ...schedule[key].map(x => ({
            cinemaId: +key,
            showTime: x[0],
            version: x[1],
          }))
        )
      }

      await tx.movies.create({
        data: {
          title,
          originalTitle,
          director,
          cast: cast.join(","),
          poster,
          release,
          duration,
          synopsis,
          genres: genres.join(","),
          schedules: {
            createMany: {
              data: finalSchedule
            }
          }
        }
      })
    }
  })

  let [cinemasCount, moviesCount, schedulesCount] = [await client.cinemas.count(), await client.movies.count(), await client.schedules.count()]

  console.table({
    timeTaken: (performance.now() - startTime) / 1000,
    requestNumber,
    cinemasCount,
    moviesCount,
    schedulesCount
  })
})

if (values.fetch) {
  job.trigger()
}

const app = new Elysia()
  .use(compression({
    TTL: 3000,
  }))
  .use(staticPlugin({
    assets: "./server/public/dist/assets",
    prefix: "/assets",
    indexHTML: true,
    maxAge: 86400,
    noCache: false,
    headers: {
      "Cache-Control": "max-age=86400, public"
    }
  }))
  .decorate("movies", new Movies())
  .decorate("schedules", new Schedules())
  .get("/", () => Bun.file("./server/public/dist/index.html"), {
    // headers: {

    // }
  })
  .get("/robots.txt", () => Bun.file("./server/public/robots.txt"))
  .group("/api", (app) =>
    app
      .get("/movies", async ({ movies, schedules, query }) => {
        const date = new Date(query.date ?? Date.now())
        const maxPage = Math.floor(await movies.getCount(date, query.search) / MOVIES_PER_PAGE)
        console.log(maxPage)
        let page = query.page ?? 0

        if (page > maxPage) page = maxPage

        const moviesToday = await movies.get(date, page, query.search)

        if (moviesToday.length === 0) {
          return {
            maxPage: 0,
            page,
            movies: [],
            schedules: []
          }
        }

        const moviesSchedules = await schedules.get(moviesToday, date)

        if (moviesSchedules.length === 0) {
          return {
            maxPage: 0,
            page,
            movies: [],
            schedules: []
          }
        }

        return {
          maxPage,
          page,
          movies: moviesToday,
          schedules: moviesSchedules
        }
      }, {
        query: t.Object({
          date: t.Optional(t.String()),
          page: t.Optional(t.Number({ minimum: 0 })),
          search: t.Optional(t.String()),
        })
      })
  )
  .listen(3000)

console.log("Started on http://localhost:3000");
