import type { Movie } from "server/types/schema";
import { Database } from "bun:sqlite"

export type SerialiazedMovie = Movie & {
  genres: string
  cast: string
  release: string
}

export class DB extends Database {
  constructor(filename: string) {
    super(filename)
    
    this.exec(`
CREATE TABLE IF NOT EXISTS cinemas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY ,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255) NOT NULL,
  cast TEXT,
  duration INT,
  poster VARCHAR(255) NOT NULL,
  release DATE NOT NULL,
  synopsis TEXT,
  genres TEXT NOT NULL,
  UNIQUE (title)
);

CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY ,
  cinemaId INT NOT NULL,
  movieId INT NOT NULL,
  showTime DATETIME NOT NULL,
  FOREIGN KEY (cinemaId) REFERENCES cinemas(id),
  FOREIGN KEY (movieId) REFERENCES movies(id)
);

CREATE INDEX IF NOT EXISTS idx_schedules_showTime 
ON schedules (showTime);
    `)
  }

  public movies = {
    deserialize(movie: SerialiazedMovie): Movie {
      // @ts-ignore
      movie.genres = movie.genres.split(",")
      // @ts-ignore
      movie.cast = movie.cast.split(",")
      // @ts-ignore
      movie.release = new Date(movie.release)

      return movie as Movie
    }
  }
}

export const db = new DB("db.db3");
