import type { Movie } from "@/types/schema";
import { db, type SerialiazedMovie } from "../db"

const MOVIES_PER_PAGE = 2000

export class Movies {
  constructor() { }

  getCount(date: Date): number {
    let stmt = db.query("SELECT COUNT(DISTINCT m.id) as count FROM movies m LEFT JOIN schedules s ON m.id = s.movieId WHERE DATE(s.showTime) = ?")

    return (stmt.get(Intl.DateTimeFormat("en-CA").format(date)) as { count: number }).count
  }

  get(date: Date, page: number): Movie[] {
    let stmtMovies = db.query(
      `SELECT 
        m.id,
        m.title,
        m.director,
        m.cast,
        m.duration,
        m.poster,
        m.release,
        m.synopsis,
        m.genres,
        COUNT(s.id) as schedule_count
      FROM
        movies m
      LEFT JOIN 
        schedules s ON m.id = s.movieId
      WHERE
        DATE(s.showTime) = ? AND
        s.cinemaId IN (10,11,7,4,1,12,8,5)
      GROUP BY
        m.id, m.title, m.director, m.cast, m.duration, m.poster, m.release
      ORDER BY
        schedule_count DESC
      LIMIT ?
      OFFSET ?`
    )

    let seriliazedMovies = stmtMovies.all(
      Intl.DateTimeFormat("en-CA").format(date),
      page * MOVIES_PER_PAGE,
      page === 1 ? 0 : (page - 1) * MOVIES_PER_PAGE
    ) as SerialiazedMovie[]
    let movies: Movie[] = []

    for (let i = 0; i < seriliazedMovies.length; i++) {
      const m = seriliazedMovies[i];
      movies[i] = db.movies.deserialize(m)
    }

    return movies
  }
}