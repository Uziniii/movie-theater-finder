import type { Movie } from "@/types/schema";
import { db } from "../db";

export class Schedules {
  
  get(movies: Movie[], date: Date) {
    const stmtSchedules = db.query(
      `SELECT
        c.name as cinema,
        GROUP_CONCAT(s.showTime ORDER BY s.showTime) AS showTimes,
        s.movieId
      FROM schedules s
      LEFT JOIN cinemas c
      ON c.id = s.cinemaId
      WHERE
        s.movieId IN (${[...Array(movies.length)].fill("?").join(",")}) 
        AND DATE(s.showTime) = ?
      GROUP BY s.movieId, s.cinemaId`
    )
    
    return stmtSchedules.all(
      ...movies.map(x => x.id) as any,
      Intl.DateTimeFormat("en-CA").format(date)
    )
  }
}
