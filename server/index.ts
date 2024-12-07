import { Cron } from "croner";
import { client } from "./db/client.ts";
import { parseArgs } from "util";
import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { Movies, MOVIES_PER_PAGE } from "./db/models/Movies.ts";
import { Schedules } from "./db/models/Schedules.ts";
import { getMoviesData } from "@/fetch-allocine.ts";
import cinemas from "@/../prisma/cinemas.json"

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

await client.$executeRawUnsafe(`
  INSERT OR IGNORE INTO cinemas (name, url) VALUES ${cinemas.map(x => `("${x.name}", "${x.url}")`).join(",")}
`);

const job = new Cron("@daily", async () => {
  let startTime = performance.now()

  const cinemas = await client.cinemas.findMany();

  const [moviesMap, requestNumber] = await getMoviesData(cinemas)
  const movies = Array.from(moviesMap.values())

  await client.$transaction(async (tx) => {
    await tx.schedules.deleteMany()
    await tx.movies.deleteMany()

    for (let i = 0; i < movies.length; i++) {
      const { title, cast, director, duration, genres, poster, release, schedule, synopsis } = movies[i];      
      
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
  .use(staticPlugin({
    assets: "./dist/assets",
    prefix: "/assets"
  }))
  .decorate("movies", new Movies())
  .decorate("schedules", new Schedules())
  .get("/", () => Bun.file("./dist/index.html"))
  .group("/api", (app) =>
    app
      .get("/movies", async ({ movies, schedules, query }) => {
        const date = new Date(query.date ?? Date.now())
        const maxPage = Math.floor(await movies.getCount(date, query.search) / MOVIES_PER_PAGE)
        let page = query.page ?? 0

        if (page > maxPage) page = maxPage

        const moviesToday = await movies.get(date, page, query.search)

        return {
          maxPage,
          movies: moviesToday,
          schedules: moviesToday.length === 0 ? [] : await schedules.get(moviesToday, date)
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
