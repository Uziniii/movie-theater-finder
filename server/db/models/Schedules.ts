import { client } from "../client";
import type { Schedule } from "@/api";
import { Prisma } from "@prisma/client";

export class Schedules {
  async get(movies: { id: number, [key: string]: any }[], date: Date) {
    const dateEnd = new Date(date)
    dateEnd.setDate(dateEnd.getDate() + 1)
    dateEnd.setHours(0, 0, 0, 0)

    date.setHours(0, 0, 0, 0)

    if (date.getTime() === new Date(Date.now()).setHours(0, 0, 0, 0)) {
      let today = new Date(Date.now())
      date.setHours(today.getHours(), today.getMinutes() - 20)
    }

    const schedules = await client.$queryRaw<Schedule[]>`
      SELECT
        c.name as cinema,
        GROUP_CONCAT(s.showTime ORDER BY s.showTime SEPARATOR ',') as showTimes,
        s.version,
        s.movieId
      FROM schedules s
      LEFT JOIN cinemas c
      ON c.id = s.cinemaId
      WHERE
        s.movieId IN (${Prisma.join(movies.map(x => x.id))})
        AND s.showTime BETWEEN FROM_UNIXTIME(${date.getTime() / 1000}) 
                          AND FROM_UNIXTIME(${dateEnd.getTime() / 1000})
      GROUP BY s.movieId, s.version, c.id
    `

    return schedules
  }
}
