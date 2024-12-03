import type { Movie } from "@/types/schema";
import { client } from "../client";
import type { Schedule } from "@/api";
import { Prisma } from "@prisma/client";

export class Schedules {
  async get(movies: Movie[], date: Date) {
    const dateEnd = new Date(date)
    dateEnd.setDate(dateEnd.getDate() + 1)
    dateEnd.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    
    const schedules = await client.$queryRaw<Schedule[]>`
      SELECT
        c.name as cinema,
        GROUP_CONCAT(CASE WHEN s.version = "vo" THEN s.showTime END ORDER BY s.showTime) AS showTimesVO,
        GROUP_CONCAT(CASE WHEN s.version = "vf" THEN s.showTime END ORDER BY s.showTime) AS showTimesVF,
        GROUP_CONCAT(CASE WHEN s.version = "dub" THEN s.showTime END ORDER BY s.showTime) AS showTimesDub,
        s.movieId
      FROM schedules s
      LEFT JOIN cinemas c
      ON c.id = s.cinemaId
      WHERE 
        s.movieId IN (${Prisma.join(movies.map(x => x.id))}) AND 
        (s.showTime >= ${date.getTime()} AND s.showTime <= ${dateEnd.getTime()})
      GROUP BY s.movieId, c.id
    `

    return schedules
  }
}

// ${movies.map(x => x.id.toString()).join(",")}