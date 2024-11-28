import playwright from "playwright"
import type { Cinema, Movie } from "./types/schema";

type Schedule = {
  [cinema: string]: Date[]
}

export async function scraping(cinemas: Cinema[]) {
  const movies: Map<string, Omit<Movie, "id"> & { schedule: Schedule }> = new Map();

  const browser = await playwright.chromium.launch({
    headless: true
  });

  async function get(cinema: Cinema, date: Date) {
    let formatedDate = new Intl.DateTimeFormat('en-CA').format(date)

    const page = await browser.newPage();

    await page.goto(`${cinema.url}#shwt_date=${formatedDate}`);
    await page.waitForTimeout(2000);

    const moviesList = await page.$(".showtimes-list-holder")
    const moviesCard = await moviesList?.$$("div.card")

    if (!moviesCard) return

    for (let i = 0; i < moviesCard?.length; i++) {
      let m = moviesCard[i]
      let title = await (await m.$(".meta-title-link"))?.innerText()

      if (!title) return

      let movie = movies.get(title)

      let schedule: Schedule = movie
        ? movie.schedule[cinema.id]
          ? movie.schedule
          : { ...movie.schedule, [cinema.id]: [] }
        : { [cinema.id]: [] }

      let hours = await m.$$eval("div.showtimes-versions-holder span.showtimes-hour-item-value", spans => spans.map(x => x.innerHTML))
      let showtime = hours.map(x => {
        let date = new Date(formatedDate)

        let [hour, minute] = x.split(":")

        date.setHours(+hour)
        date.setMinutes(+minute)

        return date
      })

      schedule[cinema.id] = [...schedule[cinema.id], ...showtime]

      if (movie) {
        movies.set(title, { ...movie, schedule })
      } else {
        movies.set(title, {
          title,
          cast: await Promise.all((await m.$$("div.meta-body-actor a.dark-grey-link")).map(x => x.innerText())),
          director: await (await m.$("div.meta-body-direction a.dark-grey-link"))?.innerText() ?? "",
          duration: await m.$eval("div.meta-body-info", (n) => {
            let text = n.childNodes[2].textContent

            if (text) {
              return text.split(" ")
                .map(x => {
                  let time = x.length == 2 ? x.substring(0, 1) : x.substring(0, 2);
                  return (time.length == 1 ? +time * 60 : +time)
                })
                .reduce((x, acc) => x + acc)
            }

            return 0
          }).catch(() => NaN),
          release: await m.$eval("div.meta-body-info", (n) => {
            let date = n.childNodes[0].textContent

            if (date) {
              return new Date(date)
            }

            return new Date(Date.now())
          }).catch(() => new Date()),
          poster: await (await m.$("img.thumbnail-img"))?.getAttribute("src") ?? "",
          schedule,
          synopsis: await (await m.$("div.synopsis div.content-txt"))?.innerText() ?? "",
          genres: await m.$$eval("div.meta-body-info a:not(.nationality)", (n) => {
            return n.map(x => x.textContent ?? "")
          }).catch(() => [])
        })
      }
    }

    await page.close()
  }

  for (let i = 0; i < 7; i++) {
    await Promise.all(
      cinemas.map(x => new Promise(async res => {
        let date = new Date(Date.now())

        date.setDate(date.getDate() + i)

        res(await get(x, date))
      }))
    )
  }

  await browser.close();

  return movies
}
