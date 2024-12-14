import { url } from "./lib/url"

type ScheduleFromServer = {
  cinema: string
  showTimes: string
  version: "vo" | "vf" | "dub"
  movieId: number
}

export type Schedule = Omit<ScheduleFromServer, "showTimes"> & {
  showTimes: string[]
}

type MovieFromServer = {
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

export type Movie = MovieFromServer & {
  schedules: Schedule[]
}

type Group = {
  vo: Schedule[]
  dub: Schedule[]
  vf: Schedule[]
}

const order: ("vo" | "dub" | "vf")[] = ["vo", "dub", "vf"];

function customSort(schedules: ScheduleFromServer[]): Schedule[] {
  // Group items by version
  const groups: Group = {
    vo: [],
    dub: [],
    vf: []
  };

  for (let i = 0; i < schedules.length; i++) {
    const item = schedules[i];
    
    if (groups[item.version]) {
      groups[item.version].push(item as any as Schedule);
    }
  }
  
  const result = [];
  
  if (groups.vo.length && groups.dub.length && groups.vf.length) {
    // Case with "vo", "dub", and "vf"
    if (groups.vo.length) result.push(...groups.vo.splice(0, 2));
    if (groups.dub.length) result.push(...groups.dub.splice(0, 2));
    if (groups.vf.length) result.push(...groups.vf.splice(0, 2));
  } else if (groups.vo.length && groups.dub.length) {
    // Case with "vo" and "dub" only
    if (groups.vo.length) result.push(...groups.vo.splice(0, 3));
    if (groups.dub.length) result.push(...groups.dub.splice(0, 3));
  }
  
  // Add the remaining items in the specified order
  for (const type of order) {
    result.push(...groups[type]);
  }
  console.log(result);
  
  return result.map(x => ({
    ...x,
    showTimes: (x.showTimes as any).split(",")
  }));
}

export async function fetchMovies({ queryKey }: { queryKey: [string, string | undefined, number | undefined, string | undefined] }) {
  const response = await fetch(
    url("/api/movies", {
      date: queryKey[1],
      page: queryKey[2],
      search: queryKey[3]
    })
  )
  
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  
  let data = await response.json() as any as {
    maxPage: number
    movies: MovieFromServer[]
    schedules: ScheduleFromServer[]
  }
  
  let movies = data.movies.map(m => {
    return {
      ...m,
      schedules: customSort(
        data.schedules
          .filter(s => s.movieId === m.id)
          .sort((a, b) => b.showTimes.length - a.showTimes.length)
      )
    }
  })

  return {
    maxPage: data.maxPage,
    movies
  }
}