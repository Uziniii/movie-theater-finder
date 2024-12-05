import type { AllocineMoviesResponse } from "@/types/allocine-movies-response";
import type { Cinema, Movie } from "@/types/schema";

type Schedule = {
  [cinema: string]: [Date, "vo" | "vf" | "dub"][]
}

type MoviesMap = Map<string, Omit<Movie, "id"> & { schedule: Schedule }>

export async function getMoviesData(cinemas: Cinema[]): Promise<[MoviesMap, number]> {
  let requestNumber = 0;
  const movies: MoviesMap = new Map();

  async function getMovies(cinema: Cinema, date: Date, page: number = 1) {
    let formatedDate = new Intl.DateTimeFormat('en-CA').format(date)
    let cinemaCode = cinema.url.split("=")[1].replace(".html", "")

    const pageUrl = page === 1 ? "" : `p-${page}/`

    let result = await (await fetch(`https://www.allocine.fr/_/showtimes/theater-${cinemaCode}/d-${formatedDate}/${pageUrl}`, {
      "headers": {
        "accept": "*/*",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "priority": "u=1, i",
      },
      "referrer": `${cinema.url}#shwt_date=${formatedDate}`,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify({ "filters": [] }),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })).json() as AllocineMoviesResponse;

    requestNumber++;
    
    for (let i = 0; i < result.results.length; i++) {
      const { movie, showtimes } = result.results[i];

      let m = movies.get(movie.title)
      
      let schedule: Schedule = m
        ? m.schedule[cinema.id]
          ? m.schedule
          : { ...m.schedule, [cinema.id]: [] }
        : { [cinema.id]: [] }

      let showtimesExtracted = [
        ...showtimes.local.map(x => [new Date(x.startsAt), "vf"]),
        ...showtimes.original.map(x => [new Date(x.startsAt), "vo"]),
        ...showtimes.dubbed.map(x => [new Date(x.startsAt), "dub"])
      ] as [Date, "vo" | "vf" | "dub"][]
      schedule[cinema.id] = [...schedule[cinema.id], ...showtimesExtracted]
      
      if (m) {
        movies.set(movie.title, { ...m, schedule })
      } else {
        movies.set(movie.title, {
          title: movie.title,
          cast: movie.cast.nodes.map(x => {
            if (x.actor) {
              return `${x.actor.firstName} ${x.actor.lastName}`
            } else if (x.originalVoiceActor) {
              return `${x.originalVoiceActor.firstName} ${x.originalVoiceActor.lastName}`
            } else if (x.voiceActor) {
              return `${x.voiceActor.firstName} ${x.voiceActor.lastName}`
            }

            return ""
          }),
          director: movie.credits.length > 0 ? `${movie.credits[0].person.firstName} ${movie.credits[0].person.lastName}` : "",
          duration: movie.runtime
            .split(" ")
            .map(x => {
              let time = x.length == 2 ? x.substring(0, 1) : x.substring(0, 2);
              return (time.length == 1 ? +time * 60 : +time)
            })
            .reduce((x, acc) => x + acc),
          genres: movie.genres.map(x => x.translate),
          poster: movie.poster !== null ? movie.poster.url : "",
          release: new Date(movie.releases.at(-1)?.releaseDate?.date ?? Date.now()),
          synopsis: movie.synopsis_json?.body?.[0]?.children?.[0]?.text ?? "",
          schedule,
        })
      }
    }

    if (result.pagination.totalPages !== 0 && result.pagination.totalPages !== page) {
      await getMovies(cinema, date, page + 1)
    }
  }

  for (let i = 0; i < 7; i++) {
    await Promise.all(
      cinemas.map(x => new Promise(async res => {
        let date = new Date(Date.now())

        date.setDate(date.getDate() + i)

        res(await getMovies(x, date))
      }))
    )
  }

  return [movies, requestNumber]
}
