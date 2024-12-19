import { client } from "../client";
import type { Schedule } from "@/api";
import { Prisma } from "@prisma/client";

export class Schedules {
  async get(movies: { id: number, [key: string]: any}[], date: Date) {
    const dateEnd = new Date(date)
    dateEnd.setDate(dateEnd.getDate() + 1)
    dateEnd.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    
    const schedules = await client.$queryRaw<Schedule[]>`
      SELECT
        c.name as cinema,
        GROUP_CONCAT(s.showTime ORDER BY s.showTime) as showTimes,
        s.version,
        s.movieId
      FROM schedules s
      LEFT JOIN cinemas c
      ON c.id = s.cinemaId
      WHERE
        s.movieId IN (${Prisma.join(movies.map(x => x.id))}) AND 
        (s.showTime >= ${date.getTime()} AND s.showTime <= ${dateEnd.getTime()})
      GROUP BY s.movieId, s.version, c.id
    `

    // const schedules = await client.$queryRaw<Schedule[]>`
    //   SELECT
    //     c.name as cinema,
    //     GROUP_CONCAT(s.showTime ORDER BY s.showTime) as showTimes,
    //     s.version,
    //     s.movieId
    //   FROM schedules s
    //   LEFT JOIN cinemas c
    //   ON c.id = s.cinemaId
    //   WHERE
    //     s.movieId IN (2101) AND 
    //     (s.showTime >= ${date.getTime()} AND s.showTime <= ${dateEnd.getTime()})
    //   GROUP BY s.movieId, s.version, c.id
    // `
    // console.log(schedules);
    

    return schedules
  }
}
