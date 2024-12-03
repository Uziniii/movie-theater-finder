import { url } from "./lib/url"

export type Schedule = {
  cinema: string
  showTimesVO: string | null
  showTimesVF: string | null
  showTimesDUB: string | null
  movieId: number
}

export type Movie = {
  id: number
  title: string
  director: string
  cast: string
  duration: number
  poster: string
  release: string
  synopsis: string
  genres: string
}

export async function fetchMovies({ queryKey }: { queryKey: [string, Date | undefined] }) {
  const response = await fetch(url("/api/movies", { date: queryKey[1]?.toJSON() }))
  
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  
  return response.json() as any as {
    count: number
    movies: Movie[]
    schedules: Schedule[]
  }
}