import * as cheerio from 'cheerio';
import createRateLimitedFetch from "../server/helpers/fetcher";
import FileSystemCache from "../server/helpers/filesystem-cache";

type Cinema = {
  name: string
  address: string | null
  url: string
}

const cinemas: Cinema[] = []

const cache = new FileSystemCache("allocine-cinemas")
const limitedFetch = createRateLimitedFetch(4, cache)

let page = 0
while (true) {
  const url = `https://www.allocine.fr/salle/cinema/ville-115755/?page=${page}`
  const response = await limitedFetch(url, undefined, `page-${page}.html`)
  const $ = cheerio.load(await response.text())
  
  const data = $("#content-layout > div.section.section-wrap.gd-2-cols.gd-gap-30 > div > ul > li > div > div > div").extract({
    name: ["div.meta-theater-title > h2 a"],
    address: ["address.address"],
    url: [{
      selector: "div.meta-theater-title > h2 a",
      value: "href"
    }]
  })
  
  const result = data.name.map((x, i) => ({
    name: x.trim(),
    address: data.address?.[i]?.trim(),
    url: data.url?.[i]
  }))
  
  cinemas.push(...result)
  
  if ($("#content-layout > div.section.section-wrap.gd-2-cols.gd-gap-30 > div > ul > nav > span.button-right.button-disabled").html() !== null)
    break

  page++
}

Bun.write("prisma/cinemas.json", JSON.stringify(cinemas, null, 2) + "\n")
